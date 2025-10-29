/**
 * Authentication Service
 * Handles authentication business logic
 */
import { IUser, IAuthResponse } from "../types";
/**
 * Register a new user
 */
export declare const registerUser: (email: string, password: string, name: string) => Promise<IAuthResponse>;
/**
 * Login user with email and password
 */
export declare const loginUser: (email: string, password: string) => Promise<IAuthResponse>;
/**
 * Get current user
 */
export declare const getCurrentUser: (user: IUser | null) => IUser;
//# sourceMappingURL=authService.d.ts.map