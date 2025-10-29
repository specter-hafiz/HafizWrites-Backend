/**
 * Blog Service
 * Handles blog-related business logic
 */
import { IBlog, ICreateBlogInput, IUpdateBlogInput, IPaginatedBlogs, IUser } from "../types";
/**
 * Create a new blog post
 */
export declare const createBlog: (input: ICreateBlogInput, authorId: string) => Promise<IBlog>;
/**
 * Update an existing blog post
 */
export declare const updateBlog: (input: IUpdateBlogInput) => Promise<IBlog>;
/**
 * Delete a blog post
 */
export declare const deleteBlog: (id: string) => Promise<void>;
/**
 * Get single blog by ID or slug
 */
export declare const getBlog: (id?: string, slug?: string, user?: IUser | null) => Promise<IBlog>;
/**
 * Get paginated blogs with filtering
 */
export declare const getBlogs: (status?: string, tag?: string, category?: string, page?: number, limit?: number, search?: string, user?: IUser | null) => Promise<IPaginatedBlogs>;
/**
 * Get all tags
 */
export declare const getAllTags: (user?: IUser | null) => Promise<string[]>;
/**
 * Get all categories
 */
export declare const getAllCategories: (user?: IUser | null) => Promise<string[]>;
//# sourceMappingURL=blogService.d.ts.map