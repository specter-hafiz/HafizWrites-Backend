/**
 * Blog Service
 * Handles blog-related business logic
 */

import Blog from "../models/Blog";
import {
  IBlog,
  ICreateBlogInput,
  IUpdateBlogInput,
  IPaginatedBlogs,
  IUser,
} from "../types";
import { deleteImage } from "./imageService";

/**
 * Create a new blog post
 */
export const createBlog = async (
  input: ICreateBlogInput,
  authorId: string
): Promise<IBlog> => {
  try {
    const validStatuses = ["draft", "published", "archived"];
    if (input.status && !validStatuses.includes(input.status)) {
      throw new Error("Invalid status. Must be: draft, published, or archived");
    }

    const blogData: any = {
      title: input.title,
      content: input.content,
      excerpt: input.excerpt,
      slug: input.slug,
      featuredImage: input.featuredImage,
      images: input.images || [],
      author: authorId,
      status: input.status || "draft",
      tags: input.tags ? input.tags.map((tag) => tag.toLowerCase()) : [],
      categories: input.categories
        ? input.categories.map((cat) => cat.toLowerCase())
        : [],
      metadata: input.metadata || {},
    };

    // Set publishedAt if status is published
    if (blogData.status === "published") {
      blogData.publishedAt = new Date();
    }

    const blog = new Blog(blogData);
    await blog.save();

    // Populate author before returning
    await blog.populate("author");

    return blog;
  } catch (error) {
    throw new Error(`Failed to create blog: ${(error as Error).message}`);
  }
};

/**
 * Update an existing blog post
 */
export const updateBlog = async (input: IUpdateBlogInput): Promise<IBlog> => {
  try {
    const blog = await Blog.findById(input.id);
    if (!blog) {
      throw new Error("Blog not found");
    }

    const validStatuses = ["draft", "published", "archived"];
    if (input.status && !validStatuses.includes(input.status)) {
      throw new Error("Invalid status. Must be: draft, published, or archived");
    }

    // Update fields if provided
    if (input.title !== undefined) blog.title = input.title;
    if (input.content !== undefined) blog.content = input.content;
    if (input.excerpt !== undefined) blog.excerpt = input.excerpt;
    if (input.slug !== undefined) blog.slug = input.slug;
    if (input.featuredImage !== undefined)
      blog.featuredImage = input.featuredImage;
    if (input.images !== undefined) blog.images = input.images;
    if (input.tags !== undefined)
      blog.tags = input.tags.map((tag) => tag.toLowerCase());
    if (input.categories !== undefined)
      blog.categories = input.categories.map((cat) => cat.toLowerCase());

    // Update status and publishedAt
    if (input.status !== undefined) {
      const wasPublished = blog.status === "published";
      blog.status = input.status;

      if (input.status === "published" && !wasPublished) {
        blog.publishedAt = new Date();
      }
    }

    // Update metadata
    if (input.metadata !== undefined) {
      blog.metadata = { ...blog.metadata, ...input.metadata };
    }

    await blog.save();
    await blog.populate("author");

    return blog;
  } catch (error) {
    throw new Error(`Failed to update blog: ${(error as Error).message}`);
  }
};

/**
 * Delete a blog post
 */
export const deleteBlog = async (id: string): Promise<void> => {
  try {
    const blog = await Blog.findById(id);
    if (!blog) {
      throw new Error("Blog not found");
    }

    // Delete featured image from Cloudinary
    if (blog.featuredImage?.publicId) {
      try {
        await deleteImage(blog.featuredImage.publicId);
      } catch (error) {
        console.error("Error deleting featured image:", error);
      }
    }

    // Delete all associated images from Cloudinary
    if (blog.images && blog.images.length > 0) {
      for (const image of blog.images) {
        if (image.publicId) {
          try {
            await deleteImage(image.publicId);
          } catch (error) {
            console.error("Error deleting image:", error);
          }
        }
      }
    }

    // Delete blog from database
    await Blog.findByIdAndDelete(id);
  } catch (error) {
    throw new Error(`Failed to delete blog: ${(error as Error).message}`);
  }
};

/**
 * Get single blog by ID or slug
 */
export const getBlog = async (
  id?: string,
  slug?: string,
  user?: IUser | null
): Promise<IBlog> => {
  try {
    let blog: IBlog | null = null;

    if (id) {
      blog = await Blog.findById(id).populate("author");
    } else if (slug) {
      blog = await Blog.findOne({ slug }).populate("author");
    } else {
      throw new Error("Please provide either an ID or slug");
    }

    if (!blog) {
      throw new Error("Blog not found");
    }

    // Only show published blogs to non-authenticated users
    if (!user && blog.status !== "published") {
      throw new Error("Blog not found");
    }

    // Increment view count for published blogs (only for public access)
    if (blog.status === "published" && !user) {
      blog.views += 1;
      await blog.save();
    }

    return blog;
  } catch (error) {
    throw new Error(`Error fetching blog: ${(error as Error).message}`);
  }
};

/**
 * Get paginated blogs with filtering
 */
export const getBlogs = async (
  status?: string,
  tag?: string,
  category?: string,
  page: number = 1,
  limit: number = 10,
  search?: string,
  user?: IUser | null
): Promise<IPaginatedBlogs> => {
  try {
    const query: any = {};

    // Only show published blogs to non-authenticated users
    if (!user) {
      query.status = "published";
    } else if (status) {
      query.status = status;
    }

    // Filter by tag
    if (tag) {
      query.tags = tag.toLowerCase();
    }

    // Filter by category
    if (category) {
      query.categories = category.toLowerCase();
    }

    // Search functionality
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { content: { $regex: search, $options: "i" } },
        { excerpt: { $regex: search, $options: "i" } },
      ];
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Execute query with pagination
    const blogs = await Blog.find(query)
      .populate("author")
      .sort({ publishedAt: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalCount = await Blog.countDocuments(query);
    const totalPages = Math.ceil(totalCount / limit);
    const hasMore = page < totalPages;

    return {
      blogs,
      totalCount,
      hasMore,
      page,
      totalPages,
    };
  } catch (error) {
    throw new Error(`Error fetching blogs: ${(error as Error).message}`);
  }
};

/**
 * Get all tags
 */
export const getAllTags = async (user?: IUser | null): Promise<string[]> => {
  try {
    const query = user ? {} : { status: "published" };
    const tags = await Blog.distinct("tags", query);
    return tags.filter((tag) => tag);
  } catch (error) {
    throw new Error(`Error fetching tags: ${(error as Error).message}`);
  }
};

/**
 * Get all categories
 */
export const getAllCategories = async (
  user?: IUser | null
): Promise<string[]> => {
  try {
    const query = user ? {} : { status: "published" };
    const categories = await Blog.distinct("categories", query);
    return categories.filter((category) => category);
  } catch (error) {
    throw new Error(`Error fetching categories: ${(error as Error).message}`);
  }
};
