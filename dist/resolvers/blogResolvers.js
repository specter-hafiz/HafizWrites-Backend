"use strict";
/**
 * Blog Resolvers
 * Handles blog-related GraphQL operations
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.blogResolvers = void 0;
const blogService = __importStar(require("../services/blogService"));
const auth_1 = require("../middleware/auth");
exports.blogResolvers = {
    Query: {
        /**
         * Get single blog by ID or slug
         */
        blog: async (_parent, args, context) => {
            return await blogService.getBlog(args.id, args.slug, context.user);
        },
        /**
         * Get all blogs with optional filtering and pagination
         */
        blogs: async (_parent, args, context) => {
            return await blogService.getBlogs(args.status, args.tag, args.category, args.page || 1, args.limit || 10, args.search, context.user);
        },
        /**
         * Get all tags
         */
        allTags: async (_parent, _args, context) => {
            return await blogService.getAllTags(context.user);
        },
        /**
         * Get all categories
         */
        allCategories: async (_parent, _args, context) => {
            return await blogService.getAllCategories(context.user);
        },
    },
    Mutation: {
        /**
         * Create a new blog post
         */
        createBlog: async (_parent, args, context) => {
            (0, auth_1.requireAdmin)(context.user);
            if (!context.user) {
                throw new Error("User not authenticated");
            }
            return await blogService.createBlog(args.input, context.user._id.toString());
        },
        /**
         * Update an existing blog post
         */
        updateBlog: async (_parent, args, context) => {
            (0, auth_1.requireAdmin)(context.user);
            return await blogService.updateBlog(args.input);
        },
        /**
         * Delete a blog post
         */
        deleteBlog: async (_parent, args, context) => {
            (0, auth_1.requireAdmin)(context.user);
            await blogService.deleteBlog(args.id);
            return {
                success: true,
                message: "Blog deleted successfully",
            };
        },
    },
};
//# sourceMappingURL=blogResolvers.js.map