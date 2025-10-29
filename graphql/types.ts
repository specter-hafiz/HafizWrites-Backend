/**
 * GraphQL Type Definitions
 * Defines all GraphQL object types for the schema
 */

import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLBoolean,
  GraphQLInputObjectType,
} from "graphql";

/**
 * User Avatar Type
 */
const UserAvatarType = new GraphQLObjectType({
  name: "UserAvatar",
  fields: {
    url: { type: GraphQLString },
    publicId: { type: GraphQLString },
  },
});

/**
 * User Type
 */
export const UserType = new GraphQLObjectType({
  name: "User",
  fields: () => ({
    id: { type: GraphQLID },
    email: { type: GraphQLString },
    name: { type: GraphQLString },
    role: { type: GraphQLString },
    bio: { type: GraphQLString },
    avatar: { type: UserAvatarType },
    createdAt: { type: GraphQLString },
    lastLogin: { type: GraphQLString },
    isActive: { type: GraphQLBoolean },
  }),
});

/**
 * Featured Image Type
 */
export const FeaturedImageType = new GraphQLObjectType({
  name: "FeaturedImage",
  fields: () => ({
    url: { type: GraphQLString },
    publicId: { type: GraphQLString },
    alt: { type: GraphQLString },
  }),
});

/**
 * Image Type
 */
export const ImageType = new GraphQLObjectType({
  name: "Image",
  fields: () => ({
    url: { type: GraphQLString },
    publicId: { type: GraphQLString },
    alt: { type: GraphQLString },
    caption: { type: GraphQLString },
  }),
});

/**
 * Blog Metadata Type
 */
export const MetadataType = new GraphQLObjectType({
  name: "Metadata",
  fields: () => ({
    readTime: { type: GraphQLInt },
    metaDescription: { type: GraphQLString },
    metaKeywords: { type: new GraphQLList(GraphQLString) },
  }),
});

/**
 * Blog Type
 */
export const BlogType = new GraphQLObjectType({
  name: "Blog",
  fields: () => ({
    id: { type: GraphQLID },
    title: { type: GraphQLString },
    slug: { type: GraphQLString },
    content: { type: GraphQLString },
    excerpt: { type: GraphQLString },
    featuredImage: { type: FeaturedImageType },
    images: { type: new GraphQLList(ImageType) },
    author: {
      type: UserType,
      resolve(parent) {
        if (parent.author && typeof parent.author === "object") {
          return parent.author;
        }
        return null;
      },
    },
    status: { type: GraphQLString },
    tags: { type: new GraphQLList(GraphQLString) },
    categories: { type: new GraphQLList(GraphQLString) },
    publishedAt: { type: GraphQLString },
    views: { type: GraphQLInt },
    metadata: { type: MetadataType },
    createdAt: { type: GraphQLString },
    updatedAt: { type: GraphQLString },
  }),
});

/**
 * Auth Response Type
 */
export const AuthResponseType = new GraphQLObjectType({
  name: "AuthResponse",
  fields: () => ({
    token: { type: GraphQLString },
    user: { type: UserType },
  }),
});

/**
 * Image Upload Response Type
 */
export const ImageUploadResponseType = new GraphQLObjectType({
  name: "ImageUploadResponse",
  fields: () => ({
    url: { type: GraphQLString },
    publicId: { type: GraphQLString },
    message: { type: GraphQLString },
  }),
});

/**
 * Paginated Blogs Type
 */
export const PaginatedBlogsType = new GraphQLObjectType({
  name: "PaginatedBlogs",
  fields: () => ({
    blogs: { type: new GraphQLList(BlogType) },
    totalCount: { type: GraphQLInt },
    hasMore: { type: GraphQLBoolean },
    page: { type: GraphQLInt },
    totalPages: { type: GraphQLInt },
  }),
});

/**
 * Success Response Type
 */
export const SuccessResponseType = new GraphQLObjectType({
  name: "SuccessResponse",
  fields: () => ({
    success: { type: GraphQLBoolean },
    message: { type: GraphQLString },
  }),
});

/**
 * Input Types
 */

/**
 * Featured Image Input Type
 */
export const FeaturedImageInputType = new GraphQLInputObjectType({
  name: "FeaturedImageInput",
  fields: {
    url: { type: GraphQLString },
    publicId: { type: GraphQLString },
    alt: { type: GraphQLString },
  },
});

/**
 * Image Input Type
 */
export const ImageInputType = new GraphQLInputObjectType({
  name: "ImageInput",
  fields: {
    url: { type: GraphQLString },
    publicId: { type: GraphQLString },
    alt: { type: GraphQLString },
    caption: { type: GraphQLString },
  },
});

/**
 * Metadata Input Type
 */
export const MetadataInputType = new GraphQLInputObjectType({
  name: "MetadataInput",
  fields: {
    metaDescription: { type: GraphQLString },
    metaKeywords: { type: new GraphQLList(GraphQLString) },
  },
});

/**
 * Create Blog Input Type
 */
export const CreateBlogInputType = new GraphQLInputObjectType({
  name: "CreateBlogInput",
  fields: {
    title: { type: new GraphQLNonNull(GraphQLString) },
    content: { type: new GraphQLNonNull(GraphQLString) },
    excerpt: { type: GraphQLString },
    slug: { type: GraphQLString },
    featuredImage: { type: FeaturedImageInputType },
    images: { type: new GraphQLList(ImageInputType) },
    status: { type: GraphQLString },
    tags: { type: new GraphQLList(GraphQLString) },
    categories: { type: new GraphQLList(GraphQLString) },
    metadata: { type: MetadataInputType },
  },
});

/**
 * Update Blog Input Type
 */
export const UpdateBlogInputType = new GraphQLInputObjectType({
  name: "UpdateBlogInput",
  fields: {
    id: { type: new GraphQLNonNull(GraphQLID) },
    title: { type: GraphQLString },
    content: { type: GraphQLString },
    excerpt: { type: GraphQLString },
    slug: { type: GraphQLString },
    featuredImage: { type: FeaturedImageInputType },
    images: { type: new GraphQLList(ImageInputType) },
    status: { type: GraphQLString },
    tags: { type: new GraphQLList(GraphQLString) },
    categories: { type: new GraphQLList(GraphQLString) },
    metadata: { type: MetadataInputType },
  },
});
