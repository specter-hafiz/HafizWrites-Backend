/**
 * Main server file
 */
import dotenv from "dotenv";
dotenv.config();
import express, { Application, Request, Response, NextFunction } from "express";
import { graphqlHTTP } from "express-graphql";
import cors from "cors";
import connectDB from "./config/database";
import schema from "./graphql/schema";
import { authenticate } from "./middleware/auth";

// Verify critical environment variables
const requiredEnvVars = [
  "MONGODB_URI",
  "JWT_SECRET",
  "CLOUDINARY_CLOUD_NAME",
  "CLOUDINARY_API_KEY",
  "CLOUDINARY_API_SECRET",
];

const missingEnvVars = requiredEnvVars.filter(
  (varName) => !process.env[varName]
);

if (missingEnvVars.length > 0) {
  console.error("❌ Missing required environment variables:");
  missingEnvVars.forEach((varName) => {
    console.error(`   - ${varName}`);
  });
  console.error(
    "\nPlease check your .env file and ensure all variables are set."
  );
  process.exit(1);
}

console.log("✅ All environment variables loaded successfully");
console.log(`📷 Cloudinary Cloud Name: ${process.env.CLOUDINARY_CLOUD_NAME}`);

// Initialize Express app
const app: Application = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// Authentication middleware
app.use(authenticate);

// GraphQL endpoint
app.use(
  "/graphql",
  graphqlHTTP((req: any) => ({
    schema: schema,
    context: {
      user: req.user,
    },
    graphiql: process.env.NODE_ENV === "development",
    customFormatErrorFn: (error: any) => {
      console.error("GraphQL Error:", error.message);
      return {
        message: error.message,
        locations: error.locations,
        path: error.path,
      };
    },
  }))
);

// Health check endpoint
app.get("/health", (_req: Request, res: Response) => {
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
app.get("/", (_req: Request, res: Response) => {
  res.json({
    message: "Personal Blog API",
    version: "1.0.0",
    graphql: "/graphql",
  });
});

// Error handling middleware
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error("Error:", err.stack);
  res.status(500).json({
    error: "Internal Server Error",
    message:
      process.env.NODE_ENV === "development"
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
process.on("unhandledRejection", (err: Error) => {
  console.error("Unhandled Promise Rejection:", err);
});

export default app;
