/**
 * Type Definitions
 * Centralized type definitions for the application
 */
import { Document, Types } from "mongoose";
/**
 * User Interface
 */
export interface IUser extends Document {
    _id: Types.ObjectId;
    email: string;
    password: string;
    name: string;
    role: "admin";
    bio?: string;
    avatar?: {
        url: string;
        publicId: string;
    };
    createdAt: Date;
    lastLogin?: Date;
    isActive: boolean;
    comparePassword(candidatePassword: string): Promise<boolean>;
}
/**
 * Blog Image Interface
 */
export interface IBlogImage {
    url: string;
    publicId: string;
    alt?: string;
    caption?: string;
}
/**
 * Blog Featured Image Interface
 */
export interface IFeaturedImage {
    url: string;
    publicId: string;
    alt?: string;
}
/**
 * Blog Metadata Interface
 */
export interface IBlogMetadata {
    readTime?: number;
    metaDescription?: string;
    metaKeywords?: string[];
}
/**
 * Blog Interface
 */
export interface IBlog extends Document {
    _id: Types.ObjectId;
    title: string;
    slug: string;
    content: string;
    excerpt?: string;
    featuredImage?: IFeaturedImage;
    images: IBlogImage[];
    author: Types.ObjectId | IUser;
    status: "draft" | "published" | "archived";
    tags: string[];
    categories: string[];
    publishedAt?: Date;
    views: number;
    metadata: IBlogMetadata;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * JWT Payload Interface
 */
export interface IJWTPayload {
    userId: string;
    email: string;
    role: string;
}
/**
 * Auth Response Interface
 */
export interface IAuthResponse {
    token: string;
    user: IUser;
}
/**
 * Image Upload Result Interface
 */
export interface IImageUploadResult {
    url: string;
    publicId: string;
    width?: number;
    height?: number;
    format?: string;
    bytes?: number;
}
/**
 * Cloudinary Upload Response
 */
export interface ICloudinaryUploadResponse {
    url: string;
    publicId: string;
    message: string;
}
/**
 * Paginated Blogs Response
 */
export interface IPaginatedBlogs {
    blogs: IBlog[];
    totalCount: number;
    hasMore: boolean;
    page: number;
    totalPages: number;
}
/**
 * Success Response Interface
 */
export interface ISuccessResponse {
    success: boolean;
    message: string;
}
/**
 * Create Blog Input
 */
export interface ICreateBlogInput {
    title: string;
    content: string;
    excerpt?: string;
    slug?: string;
    featuredImage?: IFeaturedImage;
    images?: IBlogImage[];
    status?: "draft" | "published" | "archived";
    tags?: string[];
    categories?: string[];
    metadata?: IBlogMetadata;
}
/**
 * Update Blog Input
 */
export interface IUpdateBlogInput {
    id: string;
    title?: string;
    content?: string;
    excerpt?: string;
    slug?: string;
    featuredImage?: IFeaturedImage;
    images?: IBlogImage[];
    status?: "draft" | "published" | "archived";
    tags?: string[];
    categories?: string[];
    metadata?: IBlogMetadata;
}
//# sourceMappingURL=index.d.ts.map