import { Queue } from "bullmq";
import redisConnection from "../config/redis.js";

// The compiler PRODUCES ai-analysis jobs after judging; the backend's
// aiAnalysisWorker consumes them.
const aiAnalysisQueue = new Queue(
    "ai-analysis",
    {
        connection: redisConnection,
    }
);

export default aiAnalysisQueue;
