/**
 * Authentication Resolvers
 * Handles authentication-related GraphQL operations
 */
import { IGraphQLContext } from "../types/context";
import { IAuthResponse, IUser } from "../types";
export declare const authResolvers: {
    Query: {
        /**
         * Get current authenticated user
         */
        me: (_parent: any, _args: any, context: IGraphQLContext) => IUser;
    };
    Mutation: {
        /**
         * Register a new admin user
         */
        register: (_parent: any, args: {
            email: string;
            password: string;
            name: string;
        }) => Promise<IAuthResponse>;
        /**
         * Login with email and password
         */
        login: (_parent: any, args: {
            email: string;
            password: string;
        }) => Promise<IAuthResponse>;
    };
};
//# sourceMappingURL=authResolvers.d.ts.map