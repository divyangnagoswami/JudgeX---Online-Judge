import rateLimit from "express-rate-limit";

export const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    // High ceiling: the app does live polling (submissions/verdicts refresh
    // every ~2s), so a single active user legitimately makes many requests.
    // 100/15min throttled normal usage; 1000 still guards against abuse.
    max: 1000,
    message: {
        success: false,
        message:
            "Too many requests, please try again later.",
    },
    standardHeaders: true,
    legacyHeaders: false,
});

export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: {
        success: false,
        message:
            "Too many authentication attempts. Please try again later.",
    },
    standardHeaders: true,
    legacyHeaders: false,
});

export const submissionLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 30,
    message: {
        success: false,
        message:
            "Submission rate limit exceeded. Please try again later.",
    },
    standardHeaders: true,
    legacyHeaders: false,
});