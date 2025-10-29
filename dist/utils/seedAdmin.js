"use strict";
/**
 * Seed Admin User
 * Creates an initial admin user for the application
 * Run with: npm run seed
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
const User_1 = __importDefault(require("../models/User"));
// Load environment variables
dotenv_1.default.config();
/**
 * Connect to database and create admin user
 */
const seedAdmin = async () => {
    try {
        // Validate environment variables
        if (!process.env.MONGODB_URI) {
            throw new Error("MONGODB_URI is not defined");
        }
        if (!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD) {
            throw new Error("ADMIN_EMAIL and ADMIN_PASSWORD must be defined");
        }
        // Connect to MongoDB
        await mongoose_1.default.connect(process.env.MONGODB_URI);
        console.log("Connected to MongoDB");
        // Check if admin already exists
        const existingAdmin = await User_1.default.findOne({
            email: process.env.ADMIN_EMAIL.toLowerCase(),
        });
        if (existingAdmin) {
            console.log("Admin user already exists");
            process.exit(0);
        }
        // Create admin user
        const admin = new User_1.default({
            email: process.env.ADMIN_EMAIL.toLowerCase(),
            password: process.env.ADMIN_PASSWORD,
            name: process.env.ADMIN_NAME || "Admin User",
            role: "admin",
            isActive: true,
        });
        await admin.save();
        console.log("✅ Admin user created successfully");
        console.log(`📧 Email: ${admin.email}`);
        console.log("⚠️  Please change the default password after first login");
        process.exit(0);
    }
    catch (error) {
        console.error("❌ Error seeding admin:", error.message);
        process.exit(1);
    }
};
seedAdmin();
//# sourceMappingURL=seedAdmin.js.map