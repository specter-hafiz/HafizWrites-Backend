"use strict";
/**
 * Authentication Service
 * Handles authentication business logic
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCurrentUser = exports.loginUser = exports.registerUser = void 0;
const User_1 = __importDefault(require("../models/User"));
const auth_1 = require("../middleware/auth");
/**
 * Register a new user
 */
const registerUser = async (email, password, name) => {
    try {
        // Check if user already exists
        const existingUser = await User_1.default.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            throw new Error("User with this email already exists");
        }
        // Validate password length
        if (password.length < 6) {
            throw new Error("Password must be at least 6 characters long");
        }
        // Create new user
        const user = new User_1.default({
            email: email.toLowerCase(),
            password,
            name,
            role: "admin",
        });
        await user.save();
        // Generate JWT token
        const token = (0, auth_1.generateToken)(user);
        return {
            token,
            user,
        };
    }
    catch (error) {
        throw new Error(`Registration failed: ${error.message}`);
    }
};
exports.registerUser = registerUser;
/**
 * Login user with email and password
 */
const loginUser = async (email, password) => {
    try {
        // Find user by email
        const user = await User_1.default.findOne({ email: email.toLowerCase() });
        if (!user) {
            throw new Error("Invalid email or password");
        }
        // Check if user is active
        if (!user.isActive) {
            throw new Error("Account is inactive. Please contact support.");
        }
        // Verify password
        const isValidPassword = await user.comparePassword(password);
        if (!isValidPassword) {
            throw new Error("Invalid email or password");
        }
        // Update last login
        user.lastLogin = new Date();
        await user.save();
        // Generate JWT token
        const token = (0, auth_1.generateToken)(user);
        return {
            token,
            user,
        };
    }
    catch (error) {
        throw new Error(`Login failed: ${error.message}`);
    }
};
exports.loginUser = loginUser;
/**
 * Get current user
 */
const getCurrentUser = (user) => {
    if (!user) {
        throw new Error("Not authenticated");
    }
    return user;
};
exports.getCurrentUser = getCurrentUser;
//# sourceMappingURL=authService.js.map