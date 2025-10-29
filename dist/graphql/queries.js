"use strict";
/**
 * GraphQL Queries
 * Defines all query operations
 */
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_1 = require("graphql");
const types_1 = require("./types");
const resolvers_1 = require("../resolvers");
/**
 * Root Query Type
 */
const RootQuery = new graphql_1.GraphQLObjectType({
    name: "RootQueryType",
    fields: {
        /**
         * Get single blog by ID or slug
         */
        blog: {
            type: types_1.BlogType,
            args: {
                id: { type: graphql_1.GraphQLID },
                slug: { type: graphql_1.GraphQLString },
            },
            resolve: resolvers_1.resolvers.Query.blog,
        },
        /**
         * Get all blogs with optional filtering and pagination
         */
        blogs: {
            type: types_1.PaginatedBlogsType,
            args: {
                status: { type: graphql_1.GraphQLString },
                tag: { type: graphql_1.GraphQLString },
                category: { type: graphql_1.GraphQLString },
                page: { type: graphql_1.GraphQLInt, defaultValue: 1 },
                limit: { type: graphql_1.GraphQLInt, defaultValue: 10 },
                search: { type: graphql_1.GraphQLString },
            },
            resolve: resolvers_1.resolvers.Query.blogs,
        },
        /**
         * Get current authenticated user
         */
        me: {
            type: types_1.UserType,
            resolve: resolvers_1.resolvers.Query.me,
        },
        /**
         * Get all tags
         */
        allTags: {
            type: new graphql_1.GraphQLList(graphql_1.GraphQLString),
            resolve: resolvers_1.resolvers.Query.allTags,
        },
        /**
         * Get all categories
         */
        allCategories: {
            type: new graphql_1.GraphQLList(graphql_1.GraphQLString),
            resolve: resolvers_1.resolvers.Query.allCategories,
        },
    },
});
exports.default = RootQuery;
//# sourceMappingURL=queries.js.map