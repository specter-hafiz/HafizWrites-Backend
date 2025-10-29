"use strict";
/**
 * GraphQL Type Definitions
 * Defines all GraphQL object types for the schema
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateBlogInputType = exports.CreateBlogInputType = exports.MetadataInputType = exports.ImageInputType = exports.FeaturedImageInputType = exports.SuccessResponseType = exports.PaginatedBlogsType = exports.ImageUploadResponseType = exports.AuthResponseType = exports.BlogType = exports.MetadataType = exports.ImageType = exports.FeaturedImageType = exports.UserType = void 0;
const graphql_1 = require("graphql");
/**
 * User Avatar Type
 */
const UserAvatarType = new graphql_1.GraphQLObjectType({
    name: "UserAvatar",
    fields: {
        url: { type: graphql_1.GraphQLString },
        publicId: { type: graphql_1.GraphQLString },
    },
});
/**
 * User Type
 */
exports.UserType = new graphql_1.GraphQLObjectType({
    name: "User",
    fields: () => ({
        id: { type: graphql_1.GraphQLID },
        email: { type: graphql_1.GraphQLString },
        name: { type: graphql_1.GraphQLString },
        role: { type: graphql_1.GraphQLString },
        bio: { type: graphql_1.GraphQLString },
        avatar: { type: UserAvatarType },
        createdAt: { type: graphql_1.GraphQLString },
        lastLogin: { type: graphql_1.GraphQLString },
        isActive: { type: graphql_1.GraphQLBoolean },
    }),
});
/**
 * Featured Image Type
 */
exports.FeaturedImageType = new graphql_1.GraphQLObjectType({
    name: "FeaturedImage",
    fields: () => ({
        url: { type: graphql_1.GraphQLString },
        publicId: { type: graphql_1.GraphQLString },
        alt: { type: graphql_1.GraphQLString },
    }),
});
/**
 * Image Type
 */
exports.ImageType = new graphql_1.GraphQLObjectType({
    name: "Image",
    fields: () => ({
        url: { type: graphql_1.GraphQLString },
        publicId: { type: graphql_1.GraphQLString },
        alt: { type: graphql_1.GraphQLString },
        caption: { type: graphql_1.GraphQLString },
    }),
});
/**
 * Blog Metadata Type
 */
exports.MetadataType = new graphql_1.GraphQLObjectType({
    name: "Metadata",
    fields: () => ({
        readTime: { type: graphql_1.GraphQLInt },
        metaDescription: { type: graphql_1.GraphQLString },
        metaKeywords: { type: new graphql_1.GraphQLList(graphql_1.GraphQLString) },
    }),
});
/**
 * Blog Type
 */
exports.BlogType = new graphql_1.GraphQLObjectType({
    name: "Blog",
    fields: () => ({
        id: { type: graphql_1.GraphQLID },
        title: { type: graphql_1.GraphQLString },
        slug: { type: graphql_1.GraphQLString },
        content: { type: graphql_1.GraphQLString },
        excerpt: { type: graphql_1.GraphQLString },
        featuredImage: { type: exports.FeaturedImageType },
        images: { type: new graphql_1.GraphQLList(exports.ImageType) },
        author: {
            type: exports.UserType,
            resolve(parent) {
                if (parent.author && typeof parent.author === "object") {
                    return parent.author;
                }
                return null;
            },
        },
        status: { type: graphql_1.GraphQLString },
        tags: { type: new graphql_1.GraphQLList(graphql_1.GraphQLString) },
        categories: { type: new graphql_1.GraphQLList(graphql_1.GraphQLString) },
        publishedAt: { type: graphql_1.GraphQLString },
        views: { type: graphql_1.GraphQLInt },
        metadata: { type: exports.MetadataType },
        createdAt: { type: graphql_1.GraphQLString },
        updatedAt: { type: graphql_1.GraphQLString },
    }),
});
/**
 * Auth Response Type
 */
exports.AuthResponseType = new graphql_1.GraphQLObjectType({
    name: "AuthResponse",
    fields: () => ({
        token: { type: graphql_1.GraphQLString },
        user: { type: exports.UserType },
    }),
});
/**
 * Image Upload Response Type
 */
exports.ImageUploadResponseType = new graphql_1.GraphQLObjectType({
    name: "ImageUploadResponse",
    fields: () => ({
        url: { type: graphql_1.GraphQLString },
        publicId: { type: graphql_1.GraphQLString },
        message: { type: graphql_1.GraphQLString },
    }),
});
/**
 * Paginated Blogs Type
 */
exports.PaginatedBlogsType = new graphql_1.GraphQLObjectType({
    name: "PaginatedBlogs",
    fields: () => ({
        blogs: { type: new graphql_1.GraphQLList(exports.BlogType) },
        totalCount: { type: graphql_1.GraphQLInt },
        hasMore: { type: graphql_1.GraphQLBoolean },
        page: { type: graphql_1.GraphQLInt },
        totalPages: { type: graphql_1.GraphQLInt },
    }),
});
/**
 * Success Response Type
 */
exports.SuccessResponseType = new graphql_1.GraphQLObjectType({
    name: "SuccessResponse",
    fields: () => ({
        success: { type: graphql_1.GraphQLBoolean },
        message: { type: graphql_1.GraphQLString },
    }),
});
/**
 * Input Types
 */
/**
 * Featured Image Input Type
 */
exports.FeaturedImageInputType = new graphql_1.GraphQLInputObjectType({
    name: "FeaturedImageInput",
    fields: {
        url: { type: graphql_1.GraphQLString },
        publicId: { type: graphql_1.GraphQLString },
        alt: { type: graphql_1.GraphQLString },
    },
});
/**
 * Image Input Type
 */
exports.ImageInputType = new graphql_1.GraphQLInputObjectType({
    name: "ImageInput",
    fields: {
        url: { type: graphql_1.GraphQLString },
        publicId: { type: graphql_1.GraphQLString },
        alt: { type: graphql_1.GraphQLString },
        caption: { type: graphql_1.GraphQLString },
    },
});
/**
 * Metadata Input Type
 */
exports.MetadataInputType = new graphql_1.GraphQLInputObjectType({
    name: "MetadataInput",
    fields: {
        metaDescription: { type: graphql_1.GraphQLString },
        metaKeywords: { type: new graphql_1.GraphQLList(graphql_1.GraphQLString) },
    },
});
/**
 * Create Blog Input Type
 */
exports.CreateBlogInputType = new graphql_1.GraphQLInputObjectType({
    name: "CreateBlogInput",
    fields: {
        title: { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLString) },
        content: { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLString) },
        excerpt: { type: graphql_1.GraphQLString },
        slug: { type: graphql_1.GraphQLString },
        featuredImage: { type: exports.FeaturedImageInputType },
        images: { type: new graphql_1.GraphQLList(exports.ImageInputType) },
        status: { type: graphql_1.GraphQLString },
        tags: { type: new graphql_1.GraphQLList(graphql_1.GraphQLString) },
        categories: { type: new graphql_1.GraphQLList(graphql_1.GraphQLString) },
        metadata: { type: exports.MetadataInputType },
    },
});
/**
 * Update Blog Input Type
 */
exports.UpdateBlogInputType = new graphql_1.GraphQLInputObjectType({
    name: "UpdateBlogInput",
    fields: {
        id: { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLID) },
        title: { type: graphql_1.GraphQLString },
        content: { type: graphql_1.GraphQLString },
        excerpt: { type: graphql_1.GraphQLString },
        slug: { type: graphql_1.GraphQLString },
        featuredImage: { type: exports.FeaturedImageInputType },
        images: { type: new graphql_1.GraphQLList(exports.ImageInputType) },
        status: { type: graphql_1.GraphQLString },
        tags: { type: new graphql_1.GraphQLList(graphql_1.GraphQLString) },
        categories: { type: new graphql_1.GraphQLList(graphql_1.GraphQLString) },
        metadata: { type: exports.MetadataInputType },
    },
});
//# sourceMappingURL=types.js.map