/**
 * Authentication Middleware
 * Handles JWT token verification and user authentication
 */
import { Request, Response, NextFunction } from "express";
import { IUser } from "../types";
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
export declare const authenticate: (req: Request, _res: Response, next: NextFunction) => Promise<void>;
/**
 * Require authentication
 */
export declare const requireAuth: (user: IUser | null) => void;
/**
 * Require admin role
 */
export declare const requireAdmin: (user: IUser | null) => void;
/**
 * Generate JWT token for user
 */
export declare const generateToken: (user: IUser) => string;
//# sourceMappingURL=auth.d.ts.map