import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";

import docker from "../config/docker.js";
import { languageConfig } from "./languageConfig.js";

// JUDGE_TEMP_DIR matters when the compiler itself runs inside a container
// (Docker Compose): it must be a HOST path that is ALSO bind-mounted into the
// compiler container at the SAME path, so the sibling judge containers we create
// via the host Docker socket can mount each job folder correctly. Locally it
// falls back to ./temp, so nothing changes for `npm run dev`.
const tempDir =
    process.env.JUDGE_TEMP_DIR || path.join(process.cwd(), "temp");

if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
}

/*
  Creates a sandboxed runner for one submission.

  Each job gets its own directory (so concurrent jobs don't clash — important
  for Java where the file must be Main.java). The directory is bind-mounted into
  a long-lived container ("tail -f /dev/null"); we compile once, then exec the
  program once per test case. The container is memory/CPU capped with no network.
*/
export const createRunner = async (code, language, timeLimit = 2) => {
    const config = languageConfig[language];

    if (!config) {
        throw new Error(`Unsupported language: ${language}`);
    }

    const jobId = uuidv4();
    const jobDir = path.join(tempDir, jobId);

    fs.mkdirSync(jobDir, { recursive: true });
    fs.writeFileSync(path.join(jobDir, config.source), code ?? "");

    const effectiveTime = Math.max(
        1,
        Math.ceil((Number(timeLimit) || 2) * config.timeMultiplier)
    );

    const container = await docker.createContainer({
        Image: config.image,

        Cmd: ["tail", "-f", "/dev/null"],

        Tty: false,

        HostConfig: {
            Binds: [`${jobDir}:/workspace`],

            AutoRemove: false,

            Memory: 256 * 1024 * 1024,

            NanoCpus: 1 * 1000000000,

            NetworkMode: "none",
        },
    });

    await container.start();

    const execCommand = async (command) => {
        const exec = await container.exec({
            Cmd: ["sh", "-c", command],

            AttachStdout: true,
            AttachStderr: true,
        });

        const stream = await exec.start({});

        let stdout = "";
        let stderr = "";

        docker.modem.demuxStream(
            stream,
            { write: (chunk) => { stdout += chunk.toString(); } },
            { write: (chunk) => { stderr += chunk.toString(); } }
        );

        await new Promise((resolve) => {
            stream.on("end", resolve);
        });

        const inspect = await exec.inspect();

        return {
            exitCode: inspect.ExitCode,
            stdout,
            stderr,
        };
    };

    return {
        async compile() {
            // Interpreted languages skip compilation.
            if (!config.compile) {
                return { success: true };
            }

            const result = await execCommand(config.compile);

            if (result.exitCode !== 0) {
                return {
                    success: false,
                    verdict: "Compilation Error",
                    error: result.stderr,
                };
            }

            return { success: true };
        },

        async run(input) {
            fs.writeFileSync(
                path.join(jobDir, "input.txt"),
                input ?? ""
            );

            const startTime = process.hrtime.bigint();

            // `timeout` (coreutils) returns exit code 124 when the limit is hit.
            const result = await execCommand(
                `timeout ${effectiveTime}s ${config.run} < /workspace/input.txt`
            );

            const endTime = process.hrtime.bigint();

            const executionTime =
                Number(endTime - startTime) / 1000000;

            let memoryUsed = 0;
            try {
                const stats = await container.stats({ stream: false });
                memoryUsed =
                    (stats.memory_stats?.usage || 0) / (1024 * 1024);
            } catch {}

            const metrics = {
                executionTime: Math.round(executionTime),
                memoryUsed: Number(memoryUsed.toFixed(2)),
            };

            if (result.exitCode === 124) {
                return {
                    success: false,
                    verdict: "Time Limit Exceeded",
                    error: "Execution exceeded time limit",
                    ...metrics,
                };
            }

            if (result.exitCode !== 0) {
                return {
                    success: false,
                    verdict: "Runtime Error",
                    error: result.stderr,
                    ...metrics,
                };
            }

            return {
                success: true,
                output: result.stdout,
                ...metrics,
            };
        },

        async cleanup() {
            try {
                await container.remove({ force: true });
            } catch {}

            try {
                fs.rmSync(jobDir, { recursive: true, force: true });
            } catch {}
        },
    };
};
