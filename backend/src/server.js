import "./config/loadEnv.js";

import app from "./app.js";
import connectDB from "./config/db.js";
import redisConnection from "./config/redis.js";

// NOTE: the submission judge worker now lives in the separate `compiler`
// service (OJ/compiler). The backend only enqueues submissions and runs the
// AI-analysis worker.
import "./workers/aiAnalysisWorker.js";

const PORT = process.env.PORT || 5000;

const startServer = async () => {
    await connectDB();

    app.listen(PORT, () => {
        console.log(
            `Server is running on port ${PORT}`
        );
    });
};

startServer();