/**
 * Image Resolvers
 * Handles image upload and deletion operations
 */

import { IGraphQLContext } from "../types/context";
import { ICloudinaryUploadResponse, ISuccessResponse } from "../types";
import * as imageService from "../services/imageService";
import { requireAdmin } from "../middleware/auth";

export const imageResolvers = {
  Mutation: {
    /**
     * Upload an image to Cloudinary
     */
    uploadImage: async (
      _parent: any,
      args: { imageData: string; folder?: string },
      context: IGraphQLContext
    ): Promise<ICloudinaryUploadResponse> => {
      requireAdmin(context.user);
      return await imageService.uploadImage(args.imageData, args.folder);
    },

    /**
     * Delete an image from Cloudinary
     */
    deleteImage: async (
      _parent: any,
      args: { publicId: string },
      context: IGraphQLContext
    ): Promise<ISuccessResponse> => {
      requireAdmin(context.user);
      await imageService.deleteImage(args.publicId);
      return {
        success: true,
        message: "Image deleted successfully",
      };
    },
  },
};
