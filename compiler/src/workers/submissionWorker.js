import { Worker } from "bullmq";

import redisConnection from "../config/redis.js";

import Submission from "../models/Submission.js";
import { judgeSubmission } from "../services/judgeService.js";

const worker = new Worker(
    "submissionQueue",

    async (job) => {
        const { submissionId } = job.data;

        console.log(`Processing Submission: ${submissionId}`);

        await Submission.findByIdAndUpdate(submissionId, {
            status: "Running",
        });

        // judgeSubmission sets the real verdict (Accepted / Wrong Answer /
        // Compilation Error / Runtime Error / Time Limit Exceeded) and saves it.
        // It only throws on a *system* failure (DB/Docker/etc.), handled below.
        await judgeSubmission(submissionId);

        await Submission.findByIdAndUpdate(submissionId, {
            status: "Completed",
        });

        console.log(`Submission ${submissionId} judged successfully`);
    },

    {
        connection: redisConnection,

        // Number of submissions judged simultaneously.
        concurrency: 5,
    }
);

worker.on("completed", (job) => {
    console.log(`Job ${job.id} completed`);
});

// A job that throws is retried (attempts configured on the queue). Once the
// retries are exhausted we mark the submission "Internal Error" + "Completed"
// so it never sits on "Pending" forever (and the frontend stops polling it).
worker.on("failed", async (job, err) => {
    console.log(`Job ${job?.id} failed: ${err?.message}`);

    if (!job) return;

    const maxAttempts = job.opts?.attempts || 1;

    if (job.attemptsMade < maxAttempts) return;

    try {
        await Submission.findByIdAndUpdate(job.data.submissionId, {
            status: "Completed",
            verdict: "Internal Error",
        });

        console.log(
            `Submission ${job.data.submissionId} marked as Internal Error after ${job.attemptsMade} attempt(s)`
        );
    } catch (updateErr) {
        console.error(
            "Could not mark submission as Internal Error:",
            updateErr.message
        );
    }
});

export default worker;
