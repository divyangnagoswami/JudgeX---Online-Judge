import express from "express";
import cors from "cors";

import authRoutes from "./routes/authRoutes.js";
import problemRoutes from "./routes/problemRoutes.js";
import submissionRoutes from "./routes/submissionRoutes.js";
import leaderboardRoutes from "./routes/leaderboardRoutes.js";
import userRoutes from "./routes/userRoutes.js";

import { serverAdapter } from "./config/bullBoard.js";
import setupSwagger from "./config/swagger.js";

import {
    generalLimiter,
} from "./middleware/rateLimitMiddleware.js";

import errorMiddleware from "./middleware/errorMiddleware.js";

const app = express();

app.use(cors());
// Larger limit so problems can carry sizable test-case data (default is 100kb).
app.use(express.json({ limit: "5mb" }));
app.use(generalLimiter);

app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Backend Running",
    });
});

app.use("/api/auth", authRoutes);
app.use("/api/problems", problemRoutes);
app.use("/api/submissions", submissionRoutes);
app.use("/api/leaderboard", leaderboardRoutes);
app.use("/api/users", userRoutes);

app.use(
    "/admin/queues",
    serverAdapter.getRouter()
);

setupSwagger(app);

app.use(errorMiddleware);

console.log("App loaded");

export default app;