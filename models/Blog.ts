/**
 * Blog Model
 * Defines the schema for blog posts with content, images, and metadata
 */

import mongoose, { Schema, Model } from "mongoose";
import { IBlog } from "../types";

const blogSchema = new Schema<IBlog>(
  {
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
      type: Schema.Types.ObjectId,
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
  },
  {
    timestamps: true,
  }
);

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
    const existingBlog = await mongoose.model("Blog").findOne({
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

const Blog: Model<IBlog> = mongoose.model<IBlog>("Blog", blogSchema);

export default Blog;
