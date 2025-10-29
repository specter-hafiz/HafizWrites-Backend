/**
 * Authentication Resolvers
 * Handles authentication-related GraphQL operations
 */

import { IGraphQLContext } from "../types/context";
import { IAuthResponse, IUser } from "../types";
import * as authService from "../services/authService";
import { requireAuth } from "../middleware/auth";

export const authResolvers = {
  Query: {
    /**
     * Get current authenticated user
     */
    me: (_parent: any, _args: any, context: IGraphQLContext): IUser => {
      requireAuth(context.user);
      return authService.getCurrentUser(context.user);
    },
  },

  Mutation: {
    /**
     * Register a new admin user
     */
    register: async (
      _parent: any,
      args: { email: string; password: string; name: string }
    ): Promise<IAuthResponse> => {
      return await authService.registerUser(
        args.email,
        args.password,
        args.name
      );
    },

    /**
     * Login with email and password
     */
    login: async (
      _parent: any,
      args: { email: string; password: string }
    ): Promise<IAuthResponse> => {
      return await authService.loginUser(args.email, args.password);
    },
  },
};
