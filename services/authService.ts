/**
 * Authentication Service
 * Handles authentication business logic
 */

import User from "../models/User";
import { IUser, IAuthResponse } from "../types";
import { generateToken } from "../middleware/auth";

/**
 * Register a new user
 */
export const registerUser = async (
  email: string,
  password: string,
  name: string
): Promise<IAuthResponse> => {
  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      throw new Error("User with this email already exists");
    }

    // Validate password length
    if (password.length < 6) {
      throw new Error("Password must be at least 6 characters long");
    }

    // Create new user
    const user = new User({
      email: email.toLowerCase(),
      password,
      name,
      role: "admin",
    });

    await user.save();

    // Generate JWT token
    const token = generateToken(user);

    return {
      token,
      user,
    };
  } catch (error) {
    throw new Error(`Registration failed: ${(error as Error).message}`);
  }
};

/**
 * Login user with email and password
 */
export const loginUser = async (
  email: string,
  password: string
): Promise<IAuthResponse> => {
  try {
    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase() });
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
    const token = generateToken(user);

    return {
      token,
      user,
    };
  } catch (error) {
    throw new Error(`Login failed: ${(error as Error).message}`);
  }
};

/**
 * Get current user
 */
export const getCurrentUser = (user: IUser | null): IUser => {
  if (!user) {
    throw new Error("Not authenticated");
  }
  return user;
};
