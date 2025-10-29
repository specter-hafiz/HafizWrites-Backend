/**
 * Root Resolvers
 * Combines all resolvers from different modules
 */
/**
 * Merge all resolvers
 */
export declare const resolvers: {
    Query: {
        blog: (_parent: any, args: {
            id?: string;
            slug?: string;
        }, context: import("../types/context").IGraphQLContext) => Promise<import("../types").IBlog>;
        blogs: (_parent: any, args: {
            status?: string;
            tag?: string;
            category?: string;
            page?: number;
            limit?: number;
            search?: string;
        }, context: import("../types/context").IGraphQLContext) => Promise<import("../types").IPaginatedBlogs>;
        allTags: (_parent: any, _args: any, context: import("../types/context").IGraphQLContext) => Promise<string[]>;
        allCategories: (_parent: any, _args: any, context: import("../types/context").IGraphQLContext) => Promise<string[]>;
        me: (_parent: any, _args: any, context: import("../types/context").IGraphQLContext) => import("../types").IUser;
    };
    Mutation: {
        uploadImage: (_parent: any, args: {
            imageData: string;
            folder?: string;
        }, context: import("../types/context").IGraphQLContext) => Promise<import("../types").ICloudinaryUploadResponse>;
        deleteImage: (_parent: any, args: {
            publicId: string;
        }, context: import("../types/context").IGraphQLContext) => Promise<import("../types").ISuccessResponse>;
        createBlog: (_parent: any, args: {
            input: import("../types").ICreateBlogInput;
        }, context: import("../types/context").IGraphQLContext) => Promise<import("../types").IBlog>;
        updateBlog: (_parent: any, args: {
            input: import("../types").IUpdateBlogInput;
        }, context: import("../types/context").IGraphQLContext) => Promise<import("../types").IBlog>;
        deleteBlog: (_parent: any, args: {
            id: string;
        }, context: import("../types/context").IGraphQLContext) => Promise<{
            success: boolean;
            message: string;
        }>;
        register: (_parent: any, args: {
            email: string;
            password: string;
            name: string;
        }) => Promise<import("../types").IAuthResponse>;
        login: (_parent: any, args: {
            email: string;
            password: string;
        }) => Promise<import("../types").IAuthResponse>;
    };
};
//# sourceMappingURL=index.d.ts.map