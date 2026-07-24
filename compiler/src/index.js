import "./config/loadEnv.js";

import connectDB from "./config/db.js";
import docker from "./config/docker.js";

// Importing the worker starts it (it begins consuming the submission queue).
import "./workers/submissionWorker.js";

import { supportedLanguages } from "./runners/languageConfig.js";

const start = async () => {
    await connectDB();

    // Fail fast if the Docker engine isn't reachable.
    try {
        await docker.ping();
        console.log("Docker engine reachable");
    } catch (err) {
        console.error(
            "Docker engine not reachable — start Docker Desktop.",
            err.message
        );
        process.exit(1);
    }

    console.log(
        `Compiler service started. Languages: ${supportedLanguages.join(", ")}`
    );
    console.log("Waiting for submissions...");
};

start();
