"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Main server file
 */
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const express_graphql_1 = require("express-graphql");
const cors_1 = __importDefault(require("cors"));
const database_1 = __importDefault(require("./config/database"));
const schema_1 = __importDefault(require("./graphql/schema"));
const auth_1 = require("./middleware/auth");
// Verify critical environment variables
const requiredEnvVars = [
    "MONGODB_URI",
    "JWT_SECRET",
    "CLOUDINARY_CLOUD_NAME",
    "CLOUDINARY_API_KEY",
    "CLOUDINARY_API_SECRET",
];
const missingEnvVars = requiredEnvVars.filter((varName) => !process.env[varName]);
if (missingEnvVars.length > 0) {
    console.error("❌ Missing required environment variables:");
    missingEnvVars.forEach((varName) => {
        console.error(`   - ${varName}`);
    });
    console.error("\nPlease check your .env file and ensure all variables are set.");
    process.exit(1);
}
console.log("✅ All environment variables loaded successfully");
console.log(`📷 Cloudinary Cloud Name: ${process.env.CLOUDINARY_CLOUD_NAME}`);
// Initialize Express app
const app = (0, express_1.default)();
// Connect to MongoDB
(0, database_1.default)();
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json({ limit: "50mb" }));
app.use(express_1.default.urlencoded({ extended: true, limit: "50mb" }));
// Authentication middleware
app.use(auth_1.authenticate);
// GraphQL endpoint
app.use("/graphql", (0, express_graphql_1.graphqlHTTP)((req) => ({
    schema: schema_1.default,
    context: {
        user: req.user,
    },
    graphiql: process.env.NODE_ENV === "development",
    customFormatErrorFn: (error) => {
        console.error("GraphQL Error:", error.message);
        return {
            message: error.message,
            locations: error.locations,
            path: error.path,
        };
    },
})));
// Health check endpoint
app.get("/health", (_req, res) => {
    res.status(200).json({
        status: "OK",
        message: "Server is running",
        timestamp: new Date().toISOString(),
        cloudinary: process.env.CLOUDINARY_CLOUD_NAME
            ? "configured"
            : "not configured",
    });
});
// Root endpoint
app.get("/", (_req, res) => {
    res.json({
        message: "Personal Blog API",
        version: "1.0.0",
        graphql: "/graphql",
    });
});
// Error handling middleware
app.use((err, _req, res, _next) => {
    console.error("Error:", err.stack);
    res.status(500).json({
        error: "Internal Server Error",
        message: process.env.NODE_ENV === "development"
            ? err.message
            : "Something went wrong",
    });
});
// Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📊 GraphQL endpoint: http://localhost:${PORT}/graphql`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV || "development"}`);
});
// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
    console.error("Unhandled Promise Rejection:", err);
});
exports.default = app;
//# sourceMappingURL=server.js.map