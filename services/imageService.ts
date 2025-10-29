/**
 * Image Service
 * Handles image upload and deletion via Cloudinary
 */

import {
  uploadImage as cloudinaryUpload,
  deleteImage as cloudinaryDelete,
} from "../config/cloudinary";
import { ICloudinaryUploadResponse } from "../types";

/**
 * Upload an image to Cloudinary
 */
export const uploadImage = async (
  imageData: string,
  folder?: string
): Promise<ICloudinaryUploadResponse> => {
  try {
    // Validate base64 format
    if (!imageData.startsWith("data:image")) {
      throw new Error("Invalid image format. Must be base64 encoded image.");
    }
    console.log("Uploading image to Cloudinary...");
    console.log("Image data" + imageData);

    const result = await cloudinaryUpload(imageData, folder || "blog-images");

    return {
      url: result.url,
      publicId: result.publicId,
      message: "Image uploaded successfully",
    };
  } catch (error) {
    throw new Error(`Failed to upload image: ${(error as Error).message}`);
  }
};

/**
 * Delete an image from Cloudinary
 */
export const deleteImage = async (publicId: string): Promise<void> => {
  try {
    await cloudinaryDelete(publicId);
  } catch (error) {
    throw new Error(`Failed to delete image: ${(error as Error).message}`);
  }
};
