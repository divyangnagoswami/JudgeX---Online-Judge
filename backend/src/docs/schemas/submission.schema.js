const submissionSchemas = {
    Submission: {
        type: "object",
        properties: {
            _id: {
                type: "string",
            },
            user: {
                type: "string",
            },
            problem: {
                type: "string",
            },
            language: {
                type: "string",
                example: "cpp",
            },
            status: {
                type: "string",
                example: "Completed",
            },
            verdict: {
                type: "string",
                example: "Accepted",
            },
            executionTime: {
                type: "number",
                example: 12,
            },
            memoryUsed: {
                type: "number",
                example: 5.2,
            },
            passedTestCases: {
                type: "number",
                example: 2,
            },
            totalTestCases: {
                type: "number",
                example: 2,
            },
            aiAnalysisStatus: {
                type: "string",
                example: "Completed",
            },
            createdAt: {
                type: "string",
                format: "date-time",
            },
        },
    },

    AIAnalysis: {
        type: "object",
        properties: {
            summary: {
                type: "string",
            },
            issue: {
                type: "string",
            },
            explanation: {
                type: "string",
            },
            suggestions: {
                type: "array",
                items: {
                    type: "string",
                },
            },
            complexityFeedback: {
                type: "string",
            },
            estimatedComplexity: {
                type: "string",
                example: "O(n)",
            },
            optimizedComplexity: {
                type: "string",
                example: "O(1)",
            },
            optimizationHints: {
                type: "array",
                items: {
                    type: "string",
                },
            },
        },
    },
};

export default submissionSchemas;