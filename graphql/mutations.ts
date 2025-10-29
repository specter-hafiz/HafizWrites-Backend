/**
 * GraphQL Mutations
 * Defines all mutation operations
 */

import { GraphQLObjectType, GraphQLString, GraphQLNonNull } from "graphql";
import {
  BlogType,
  AuthResponseType,
  ImageUploadResponseType,
  SuccessResponseType,
  CreateBlogInputType,
  UpdateBlogInputType,
} from "./types";
import { resolvers } from "../resolvers";

/**
 * Root Mutation Type
 */
const RootMutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    /**
     * Register a new admin user
     */
    register: {
      type: AuthResponseType,
      args: {
        email: { type: new GraphQLNonNull(GraphQLString) },
        password: { type: new GraphQLNonNull(GraphQLString) },
        name: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve: (parent, args, context, info) =>
        (resolvers.Mutation.register as any)(parent, args, context, info),
    },

    /**
     * Login with email and password
     */
    login: {
      type: AuthResponseType,
      args: {
        email: { type: new GraphQLNonNull(GraphQLString) },
        password: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve: (parent, args, context, info) =>
        (resolvers.Mutation.login as any)(parent, args, context, info),
    },

    /**
     * Create a new blog post
     */
    createBlog: {
      type: BlogType,
      args: {
        input: { type: new GraphQLNonNull(CreateBlogInputType) },
      },
      resolve: (parent, args, context, info) =>
        (resolvers.Mutation.createBlog as any)(parent, args, context, info),
    },

    /**
     * Update an existing blog post
     */
    updateBlog: {
      type: BlogType,
      args: {
        input: { type: new GraphQLNonNull(UpdateBlogInputType) },
      },
      resolve: (parent, args, context, info) =>
        (resolvers.Mutation.updateBlog as any)(parent, args, context, info),
    },

    /**
     * Delete a blog post
     */
    deleteBlog: {
      type: SuccessResponseType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve: (parent, args, context, info) =>
        (resolvers.Mutation.deleteBlog as any)(parent, args, context, info),
    },

    /**
     * Upload an image to Cloudinary
     */
    uploadImage: {
      type: ImageUploadResponseType,
      args: {
        imageData: { type: new GraphQLNonNull(GraphQLString) },
        folder: { type: GraphQLString },
      },
      resolve: (parent, args, context, info) =>
        (resolvers.Mutation.uploadImage as any)(parent, args, context, info),
    },

    /**
     * Delete an image from Cloudinary
     */
    deleteImage: {
      type: SuccessResponseType,
      args: {
        publicId: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve: (parent, args, context, info) =>
        (resolvers.Mutation.deleteImage as any)(parent, args, context, info),
    },
  },
});

export default RootMutation;
