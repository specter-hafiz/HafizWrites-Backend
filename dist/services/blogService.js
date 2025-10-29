"use strict";
/**
 * Blog Service
 * Handles blog-related business logic
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllCategories = exports.getAllTags = exports.getBlogs = exports.getBlog = exports.deleteBlog = exports.updateBlog = exports.createBlog = void 0;
const Blog_1 = __importDefault(require("../models/Blog"));
const imageService_1 = require("./imageService");
/**
 * Create a new blog post
 */
const createBlog = async (input, authorId) => {
    try {
        const validStatuses = ["draft", "published", "archived"];
        if (input.status && !validStatuses.includes(input.status)) {
            throw new Error("Invalid status. Must be: draft, published, or archived");
        }
        const blogData = {
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
        const blog = new Blog_1.default(blogData);
        await blog.save();
        // Populate author before returning
        await blog.populate("author");
        return blog;
    }
    catch (error) {
        throw new Error(`Failed to create blog: ${error.message}`);
    }
};
exports.createBlog = createBlog;
/**
 * Update an existing blog post
 */
const updateBlog = async (input) => {
    try {
        const blog = await Blog_1.default.findById(input.id);
        if (!blog) {
            throw new Error("Blog not found");
        }
        const validStatuses = ["draft", "published", "archived"];
        if (input.status && !validStatuses.includes(input.status)) {
            throw new Error("Invalid status. Must be: draft, published, or archived");
        }
        // Update fields if provided
        if (input.title !== undefined)
            blog.title = input.title;
        if (input.content !== undefined)
            blog.content = input.content;
        if (input.excerpt !== undefined)
            blog.excerpt = input.excerpt;
        if (input.slug !== undefined)
            blog.slug = input.slug;
        if (input.featuredImage !== undefined)
            blog.featuredImage = input.featuredImage;
        if (input.images !== undefined)
            blog.images = input.images;
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
    }
    catch (error) {
        throw new Error(`Failed to update blog: ${error.message}`);
    }
};
exports.updateBlog = updateBlog;
/**
 * Delete a blog post
 */
const deleteBlog = async (id) => {
    try {
        const blog = await Blog_1.default.findById(id);
        if (!blog) {
            throw new Error("Blog not found");
        }
        // Delete featured image from Cloudinary
        if (blog.featuredImage?.publicId) {
            try {
                await (0, imageService_1.deleteImage)(blog.featuredImage.publicId);
            }
            catch (error) {
                console.error("Error deleting featured image:", error);
            }
        }
        // Delete all associated images from Cloudinary
        if (blog.images && blog.images.length > 0) {
            for (const image of blog.images) {
                if (image.publicId) {
                    try {
                        await (0, imageService_1.deleteImage)(image.publicId);
                    }
                    catch (error) {
                        console.error("Error deleting image:", error);
                    }
                }
            }
        }
        // Delete blog from database
        await Blog_1.default.findByIdAndDelete(id);
    }
    catch (error) {
        throw new Error(`Failed to delete blog: ${error.message}`);
    }
};
exports.deleteBlog = deleteBlog;
/**
 * Get single blog by ID or slug
 */
const getBlog = async (id, slug, user) => {
    try {
        let blog = null;
        if (id) {
            blog = await Blog_1.default.findById(id).populate("author");
        }
        else if (slug) {
            blog = await Blog_1.default.findOne({ slug }).populate("author");
        }
        else {
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
    }
    catch (error) {
        throw new Error(`Error fetching blog: ${error.message}`);
    }
};
exports.getBlog = getBlog;
/**
 * Get paginated blogs with filtering
 */
const getBlogs = async (status, tag, category, page = 1, limit = 10, search, user) => {
    try {
        const query = {};
        // Only show published blogs to non-authenticated users
        if (!user) {
            query.status = "published";
        }
        else if (status) {
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
        const blogs = await Blog_1.default.find(query)
            .populate("author")
            .sort({ publishedAt: -1, createdAt: -1 })
            .skip(skip)
            .limit(limit);
        const totalCount = await Blog_1.default.countDocuments(query);
        const totalPages = Math.ceil(totalCount / limit);
        const hasMore = page < totalPages;
        return {
            blogs,
            totalCount,
            hasMore,
            page,
            totalPages,
        };
    }
    catch (error) {
        throw new Error(`Error fetching blogs: ${error.message}`);
    }
};
exports.getBlogs = getBlogs;
/**
 * Get all tags
 */
const getAllTags = async (user) => {
    try {
        const query = user ? {} : { status: "published" };
        const tags = await Blog_1.default.distinct("tags", query);
        return tags.filter((tag) => tag);
    }
    catch (error) {
        throw new Error(`Error fetching tags: ${error.message}`);
    }
};
exports.getAllTags = getAllTags;
/**
 * Get all categories
 */
const getAllCategories = async (user) => {
    try {
        const query = user ? {} : { status: "published" };
        const categories = await Blog_1.default.distinct("categories", query);
        return categories.filter((category) => category);
    }
    catch (error) {
        throw new Error(`Error fetching categories: ${error.message}`);
    }
};
exports.getAllCategories = getAllCategories;
//# sourceMappingURL=blogService.js.map