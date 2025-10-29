/**
 * GraphQL Queries
 * Defines all query operations
 */

import {
  GraphQLObjectType,
  GraphQLList,
  GraphQLID,
  GraphQLString,
  GraphQLInt,
} from "graphql";
import { BlogType, PaginatedBlogsType, UserType } from "./types";
import { resolvers } from "../resolvers";

/**
 * Root Query Type
 */
const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    /**
     * Get single blog by ID or slug
     */
    blog: {
      type: BlogType,
      args: {
        id: { type: GraphQLID },
        slug: { type: GraphQLString },
      },
      resolve: resolvers.Query.blog,
    },

    /**
     * Get all blogs with optional filtering and pagination
     */
    blogs: {
      type: PaginatedBlogsType,
      args: {
        status: { type: GraphQLString },
        tag: { type: GraphQLString },
        category: { type: GraphQLString },
        page: { type: GraphQLInt, defaultValue: 1 },
        limit: { type: GraphQLInt, defaultValue: 10 },
        search: { type: GraphQLString },
      },
      resolve: resolvers.Query.blogs,
    },

    /**
     * Get current authenticated user
     */
    me: {
      type: UserType,
      resolve: resolvers.Query.me,
    },

    /**
     * Get all tags
     */
    allTags: {
      type: new GraphQLList(GraphQLString),
      resolve: resolvers.Query.allTags,
    },

    /**
     * Get all categories
     */
    allCategories: {
      type: new GraphQLList(GraphQLString),
      resolve: resolvers.Query.allCategories,
    },
  },
});

export default RootQuery;
