/**
 * Blog Resolvers
 * Handles blog-related GraphQL operations
 */
import { IGraphQLContext } from "../types/context";
import { IBlog, IPaginatedBlogs, ICreateBlogInput, IUpdateBlogInput } from "../types";
export declare const blogResolvers: {
    Query: {
        /**
         * Get single blog by ID or slug
         */
        blog: (_parent: any, args: {
            id?: string;
            slug?: string;
        }, context: IGraphQLContext) => Promise<IBlog>;
        /**
         * Get all blogs with optional filtering and pagination
         */
        blogs: (_parent: any, args: {
            status?: string;
            tag?: string;
            category?: string;
            page?: number;
            limit?: number;
            search?: string;
        }, context: IGraphQLContext) => Promise<IPaginatedBlogs>;
        /**
         * Get all tags
         */
        allTags: (_parent: any, _args: any, context: IGraphQLContext) => Promise<string[]>;
        /**
         * Get all categories
         */
        allCategories: (_parent: any, _args: any, context: IGraphQLContext) => Promise<string[]>;
    };
    Mutation: {
        /**
         * Create a new blog post
         */
        createBlog: (_parent: any, args: {
            input: ICreateBlogInput;
        }, context: IGraphQLContext) => Promise<IBlog>;
        /**
         * Update an existing blog post
         */
        updateBlog: (_parent: any, args: {
            input: IUpdateBlogInput;
        }, context: IGraphQLContext) => Promise<IBlog>;
        /**
         * Delete a blog post
         */
        deleteBlog: (_parent: any, args: {
            id: string;
        }, context: IGraphQLContext) => Promise<{
            success: boolean;
            message: string;
        }>;
    };
};
//# sourceMappingURL=blogResolvers.d.ts.map