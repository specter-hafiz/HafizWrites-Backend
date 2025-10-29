/**
 * GraphQL Context Type
 * Defines the context object passed to resolvers
 */

import { IUser } from "./index";

/**
 * GraphQL Context Interface
 */
export interface IGraphQLContext {
  user: IUser | null;
}
