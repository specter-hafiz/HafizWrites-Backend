/**
 * User Model
 * Defines the schema for admin users with authentication
 */

import mongoose, { Schema, Model } from "mongoose";
import bcrypt from "bcryptjs";
import { IUser } from "../types";

const userSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
    },
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      maxlength: [100, "Name cannot exceed 100 characters"],
    },
    role: {
      type: String,
      enum: ["admin"],
      default: "admin",
    },
    bio: {
      type: String,
      maxlength: [500, "Bio cannot exceed 500 characters"],
    },
    avatar: {
      url: String,
      publicId: String,
    },
    lastLogin: {
      type: Date,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

/**
 * Hash password before saving
 */
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});

/**
 * Compare provided password with hashed password
 */
userSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw new Error("Password comparison failed");
  }
};

/**
 * Remove password from JSON output
 */
userSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;
  return user;
};

/**
 * Index for performance
 */
userSchema.index({ email: 1 });

const User: Model<IUser> = mongoose.model<IUser>("User", userSchema);

export default User;
