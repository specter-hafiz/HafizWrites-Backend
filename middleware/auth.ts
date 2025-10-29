/**
 * Authentication Middleware
 * Handles JWT token verification and user authentication
 */

import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User";
import { IUser, IJWTPayload } from "../types";

// Extend Express Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: IUser | null;
    }
  }
}

/**
 * Authenticate user from JWT token in Authorization header
 */
export const authenticate = async (
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> => {
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

    const decoded = jwt.verify(token, process.env.JWT_SECRET) as IJWTPayload;

    const user = await User.findById(decoded.userId).select("-password");

    if (!user || !user.isActive) {
      req.user = null;
      return next();
    }

    req.user = user;
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      console.error("Invalid token:", error.message);
    } else if (error instanceof jwt.TokenExpiredError) {
      console.error("Token expired:", error.message);
    } else {
      console.error("Authentication error:", error);
    }

    req.user = null;
    next();
  }
};

/**
 * Require authentication
 */
export const requireAuth = (user: IUser | null): void => {
  if (!user) {
    throw new Error("Authentication required. Please log in.");
  }

  if (!user.isActive) {
    throw new Error("Account is inactive. Please contact support.");
  }
};

/**
 * Require admin role
 */
export const requireAdmin = (user: IUser | null): void => {
  requireAuth(user);

  if (user && user.role !== "admin") {
    throw new Error("Admin access required.");
  }
};

/**
 * Generate JWT token for user
 */
export const generateToken = (user: IUser): string => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined");
  }

  return jwt.sign(
    {
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};
