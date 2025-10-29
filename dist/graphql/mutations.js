"use strict";
/**
 * GraphQL Mutations
 * Defines all mutation operations
 */
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_1 = require("graphql");
const types_1 = require("./types");
const resolvers_1 = require("../resolvers");
/**
 * Root Mutation Type
 */
const RootMutation = new graphql_1.GraphQLObjectType({
    name: "Mutation",
    fields: {
        /**
         * Register a new admin user
         */
        register: {
            type: types_1.AuthResponseType,
            args: {
                email: { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLString) },
                password: { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLString) },
                name: { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLString) },
            },
            resolve: (parent, args, context, info) => resolvers_1.resolvers.Mutation.register(parent, args, context, info),
        },
        /**
         * Login with email and password
         */
        login: {
            type: types_1.AuthResponseType,
            args: {
                email: { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLString) },
                password: { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLString) },
            },
            resolve: (parent, args, context, info) => resolvers_1.resolvers.Mutation.login(parent, args, context, info),
        },
        /**
         * Create a new blog post
         */
        createBlog: {
            type: types_1.BlogType,
            args: {
                input: { type: new graphql_1.GraphQLNonNull(types_1.CreateBlogInputType) },
            },
            resolve: (parent, args, context, info) => resolvers_1.resolvers.Mutation.createBlog(parent, args, context, info),
        },
        /**
         * Update an existing blog post
         */
        updateBlog: {
            type: types_1.BlogType,
            args: {
                input: { type: new graphql_1.GraphQLNonNull(types_1.UpdateBlogInputType) },
            },
            resolve: (parent, args, context, info) => resolvers_1.resolvers.Mutation.updateBlog(parent, args, context, info),
        },
        /**
         * Delete a blog post
         */
        deleteBlog: {
            type: types_1.SuccessResponseType,
            args: {
                id: { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLString) },
            },
            resolve: (parent, args, context, info) => resolvers_1.resolvers.Mutation.deleteBlog(parent, args, context, info),
        },
        /**
         * Upload an image to Cloudinary
         */
        uploadImage: {
            type: types_1.ImageUploadResponseType,
            args: {
                imageData: { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLString) },
                folder: { type: graphql_1.GraphQLString },
            },
            resolve: (parent, args, context, info) => resolvers_1.resolvers.Mutation.uploadImage(parent, args, context, info),
        },
        /**
         * Delete an image from Cloudinary
         */
        deleteImage: {
            type: types_1.SuccessResponseType,
            args: {
                publicId: { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLString) },
            },
            resolve: (parent, args, context, info) => resolvers_1.resolvers.Mutation.deleteImage(parent, args, context, info),
        },
    },
});
exports.default = RootMutation;
//# sourceMappingURL=mutations.js.map