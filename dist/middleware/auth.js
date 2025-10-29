"use strict";
/**
 * Authentication Middleware
 * Handles JWT token verification and user authentication
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateToken = exports.requireAdmin = exports.requireAuth = exports.authenticate = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User"));
/**
 * Authenticate user from JWT token in Authorization header
 */
const authenticate = async (req, _res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            req.user = null;
            return next();
        }
        const token = authHeader.substring(7);
        if (!token) {
            req.user = null;
            return next();
        }
        if (!process.env.JWT_SECRET) {
            throw new Error("JWT_SECRET is not defined");
        }
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        const user = await User_1.default.findById(decoded.userId).select("-password");
        if (!user || !user.isActive) {
            req.user = null;
            return next();
        }
        req.user = user;
        next();
    }
    catch (error) {
        if (error instanceof jsonwebtoken_1.default.JsonWebTokenError) {
            console.error("Invalid token:", error.message);
        }
        else if (error instanceof jsonwebtoken_1.default.TokenExpiredError) {
            console.error("Token expired:", error.message);
        }
        else {
            console.error("Authentication error:", error);
        }
        req.user = null;
        next();
    }
};
exports.authenticate = authenticate;
/**
 * Require authentication
 */
const requireAuth = (user) => {
    if (!user) {
        throw new Error("Authentication required. Please log in.");
    }
    if (!user.isActive) {
        throw new Error("Account is inactive. Please contact support.");
    }
};
exports.requireAuth = requireAuth;
/**
 * Require admin role
 */
const requireAdmin = (user) => {
    (0, exports.requireAuth)(user);
    if (user && user.role !== "admin") {
        throw new Error("Admin access required.");
    }
};
exports.requireAdmin = requireAdmin;
/**
 * Generate JWT token for user
 */
const generateToken = (user) => {
    if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET is not defined");
    }
    return jsonwebtoken_1.default.sign({
        userId: user._id.toString(),
        email: user.email,
        role: user.role,
    }, process.env.JWT_SECRET, { expiresIn: "7d" });
};
exports.generateToken = generateToken;
//# sourceMappingURL=auth.js.map