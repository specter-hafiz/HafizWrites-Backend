/**
 * Image Resolvers
 * Handles image upload and deletion operations
 */
import { IGraphQLContext } from "../types/context";
import { ICloudinaryUploadResponse, ISuccessResponse } from "../types";
export declare const imageResolvers: {
    Mutation: {
        /**
         * Upload an image to Cloudinary
         */
        uploadImage: (_parent: any, args: {
            imageData: string;
            folder?: string;
        }, context: IGraphQLContext) => Promise<ICloudinaryUploadResponse>;
        /**
         * Delete an image from Cloudinary
         */
        deleteImage: (_parent: any, args: {
            publicId: string;
        }, context: IGraphQLContext) => Promise<ISuccessResponse>;
    };
};
//# sourceMappingURL=imageResolvers.d.ts.map