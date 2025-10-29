/**
 * Root Resolvers
 * Combines all resolvers from different modules
 */

import { authResolvers } from "./authResolvers";
import { blogResolvers } from "./blogResolvers";
import { imageResolvers } from "./imageResolvers";

/**
 * Merge all resolvers
 */
export const resolvers = {
  Query: {
    ...authResolvers.Query,
    ...blogResolvers.Query,
  },
  Mutation: {
    ...authResolvers.Mutation,
    ...blogResolvers.Mutation,
    ...imageResolvers.Mutation,
  },
};
