/**
 * Blog Resolvers
 * Handles blog-related GraphQL operations
 */

import { IGraphQLContext } from "../types/context";
import {
  IBlog,
  IPaginatedBlogs,
  ICreateBlogInput,
  IUpdateBlogInput,
} from "../types";
import * as blogService from "../services/blogService";
import { requireAdmin } from "../middleware/auth";

export const blogResolvers = {
  Query: {
    /**
     * Get single blog by ID or slug
     */
    blog: async (
      _parent: any,
      args: { id?: string; slug?: string },
      context: IGraphQLContext
    ): Promise<IBlog> => {
      return await blogService.getBlog(args.id, args.slug, context.user);
    },

    /**
     * Get all blogs with optional filtering and pagination
     */
    blogs: async (
      _parent: any,
      args: {
        status?: string;
        tag?: string;
        category?: string;
        page?: number;
        limit?: number;
        search?: string;
      },
      context: IGraphQLContext
    ): Promise<IPaginatedBlogs> => {
      return await blogService.getBlogs(
        args.status,
        args.tag,
        args.category,
        args.page || 1,
        args.limit || 10,
        args.search,
        context.user
      );
    },

    /**
     * Get all tags
     */
    allTags: async (
      _parent: any,
      _args: any,
      context: IGraphQLContext
    ): Promise<string[]> => {
      return await blogService.getAllTags(context.user);
    },

    /**
     * Get all categories
     */
    allCategories: async (
      _parent: any,
      _args: any,
      context: IGraphQLContext
    ): Promise<string[]> => {
      return await blogService.getAllCategories(context.user);
    },
  },

  Mutation: {
    /**
     * Create a new blog post
     */
    createBlog: async (
      _parent: any,
      args: { input: ICreateBlogInput },
      context: IGraphQLContext
    ): Promise<IBlog> => {
      requireAdmin(context.user);

      if (!context.user) {
        throw new Error("User not authenticated");
      }

      return await blogService.createBlog(
        args.input,
        context.user._id.toString()
      );
    },

    /**
     * Update an existing blog post
     */
    updateBlog: async (
      _parent: any,
      args: { input: IUpdateBlogInput },
      context: IGraphQLContext
    ): Promise<IBlog> => {
      requireAdmin(context.user);
      return await blogService.updateBlog(args.input);
    },

    /**
     * Delete a blog post
     */
    deleteBlog: async (
      _parent: any,
      args: { id: string },
      context: IGraphQLContext
    ): Promise<{ success: boolean; message: string }> => {
      requireAdmin(context.user);
      await blogService.deleteBlog(args.id);
      return {
        success: true,
        message: "Blog deleted successfully",
      };
    },
  },
};
