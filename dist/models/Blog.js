"use strict";
/**
 * Blog Model
 * Defines the schema for blog posts with content, images, and metadata
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
const mongoose_1 = __importStar(require("mongoose"));
const blogSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: [true, "Title is required"],
        trim: true,
        maxlength: [200, "Title cannot exceed 200 characters"],
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        index: true,
    },
    content: {
        type: String,
        required: [true, "Content is required"],
    },
    excerpt: {
        type: String,
        maxlength: [500, "Excerpt cannot exceed 500 characters"],
    },
    featuredImage: {
        url: String,
        publicId: String,
        alt: String,
    },
    images: [
        {
            url: {
                type: String,
                required: true,
            },
            publicId: {
                type: String,
                required: true,
            },
            alt: String,
            caption: String,
        },
    ],
    author: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true,
    },
    status: {
        type: String,
        enum: ["draft", "published", "archived"],
        default: "draft",
        index: true,
    },
    tags: [
        {
            type: String,
            trim: true,
            lowercase: true,
        },
    ],
    categories: [
        {
            type: String,
            trim: true,
            lowercase: true,
        },
    ],
    publishedAt: {
        type: Date,
        index: true,
    },
    views: {
        type: Number,
        default: 0,
    },
    metadata: {
        readTime: {
            type: Number,
            default: 0,
        },
        metaDescription: {
            type: String,
            maxlength: 160,
        },
        metaKeywords: [String],
    },
}, {
    timestamps: true,
});
/**
 * Generate slug from title before saving
 */
blogSchema.pre("save", function (next) {
    if (this.isModified("title") && !this.isModified("slug")) {
        this.slug = this.title
            .toLowerCase()
            .replace(/[^\w\s-]/g, "")
            .replace(/\s+/g, "-")
            .replace(/--+/g, "-")
            .trim();
        if (!this.isNew && this.slug) {
            this.slug = `${this.slug}-${Date.now()}`;
        }
    }
    if (this.isModified("content")) {
        const wordCount = this.content.split(/\s+/).length;
        this.metadata.readTime = Math.max(1, Math.ceil(wordCount / 200));
    }
    if (this.isModified("content") && !this.excerpt) {
        const plainText = this.content
            .replace(/<[^>]*>/g, "")
            .replace(/\s+/g, " ")
            .trim();
        this.excerpt =
            plainText.length > 200 ? plainText.substring(0, 200) + "..." : plainText;
    }
    if (this.isModified("excerpt") && !this.metadata.metaDescription) {
        this.metadata.metaDescription = this.excerpt?.substring(0, 160);
    }
    next();
});
/**
 * Ensure slug uniqueness before saving
 */
blogSchema.pre("save", async function (next) {
    if (this.isModified("slug")) {
        const existingBlog = await mongoose_1.default.model("Blog").findOne({
            slug: this.slug,
            _id: { $ne: this._id },
        });
        if (existingBlog) {
            this.slug = `${this.slug}-${Date.now()}`;
        }
    }
    next();
});
/**
 * Indexes for better query performance
 */
blogSchema.index({ slug: 1 });
blogSchema.index({ status: 1, publishedAt: -1 });
blogSchema.index({ tags: 1 });
blogSchema.index({ categories: 1 });
blogSchema.index({ author: 1, status: 1 });
blogSchema.index({ createdAt: -1 });
/**
 * Text index for search functionality
 */
blogSchema.index({
    title: "text",
    content: "text",
    excerpt: "text",
    tags: "text",
    categories: "text",
});
const Blog = mongoose_1.default.model("Blog", blogSchema);
exports.default = Blog;
//# sourceMappingURL=Blog.js.map