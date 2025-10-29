/**
 * Cloudinary Configuration
 * Sets up Cloudinary for image upload and management
 */

import { v2 as cloudinary, UploadApiResponse } from "cloudinary";
import { IImageUploadResult } from "../types";

/**
 * Validate Cloudinary configuration
 */
const validateConfig = (): void => {
  if (
    !process.env.CLOUDINARY_CLOUD_NAME ||
    !process.env.CLOUDINARY_API_KEY ||
    !process.env.CLOUDINARY_API_SECRET
  ) {
    throw new Error(
      "Cloudinary configuration is incomplete. Please check your .env file."
    );
  }
};

// Validate before configuring
validateConfig();

// Configure Cloudinary with explicit credentials
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

// Log configuration status (without exposing secrets)
console.log("🔧 Cloudinary Configuration:");
console.log(`   Cloud Name: ${process.env.CLOUDINARY_CLOUD_NAME}`);
console.log(
  `   API Key: ${process.env.CLOUDINARY_API_KEY?.substring(0, 4)}...`
);
console.log(
  `   API Secret: ${
    process.env.CLOUDINARY_API_SECRET ? "***configured***" : "❌ missing"
  }`
);

/**
 * Upload image to Cloudinary
 * @param {string} fileBuffer - Base64 encoded image or file path
 * @param {string} folder - Folder name in Cloudinary
 * @returns {Promise<IImageUploadResult>} - Cloudinary upload result
 */
export const uploadImage = async (
  fileBuffer: string,
  folder: string = "blog-images"
): Promise<IImageUploadResult> => {
  try {
    console.log("📤 Starting Cloudinary upload...");
    console.log(`   Folder: ${folder}`);
    console.log(`   Image data length: ${fileBuffer.length}`);

    // Ensure config is set
    validateConfig();

    // Upload with explicit configuration
    const result: UploadApiResponse = await cloudinary.uploader.upload(
      fileBuffer,
      {
        folder: folder,
        resource_type: "auto",
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
        transformation: [
          { width: 1200, height: 800, crop: "limit" },
          { quality: "auto" },
          { fetch_format: "auto" },
        ],
      }
    );

    console.log("✅ Cloudinary upload successful!");
    console.log(`   URL: ${result.secure_url}`);
    console.log(`   Public ID: ${result.public_id}`);

    return {
      url: result.secure_url,
      publicId: result.public_id,
      width: result.width,
      height: result.height,
      format: result.format,
      bytes: result.bytes,
    };
  } catch (error) {
    console.error("❌ Cloudinary upload error:", error);

    // More detailed error logging
    if (error instanceof Error) {
      console.error("   Error message:", error.message);
      console.error("   Error stack:", error.stack);
    }

    // Check configuration again
    console.error("   Current config check:");
    console.error(
      `   Cloud Name: ${process.env.CLOUDINARY_CLOUD_NAME || "❌ missing"}`
    );
    console.error(
      `   API Key: ${process.env.CLOUDINARY_API_KEY || "❌ missing"}`
    );
    console.error(
      `   API Secret: ${
        process.env.CLOUDINARY_API_SECRET ? "***set***" : "❌ missing"
      }`
    );

    throw new Error(`Failed to upload image: ${(error as Error).message}`);
  }
};

/**
 * Delete image from Cloudinary
 * @param {string} publicId - Public ID of the image to delete
 * @returns {Promise<any>} - Deletion result
 */
export const deleteImage = async (publicId: string): Promise<any> => {
  try {
    console.log(`🗑️ Deleting image from Cloudinary: ${publicId}`);

    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: "image",
    });

    if (result.result !== "ok" && result.result !== "not found") {
      throw new Error(`Deletion failed: ${result.result}`);
    }

    console.log("✅ Image deleted successfully");
    return result;
  } catch (error) {
    console.error("❌ Cloudinary delete error:", error);
    throw new Error(`Failed to delete image: ${(error as Error).message}`);
  }
};

/**
 * Delete multiple images from Cloudinary
 * @param {string[]} publicIds - Array of public IDs to delete
 * @returns {Promise<PromiseSettledResult<any>[]>} - Deletion results
 */
export const deleteMultipleImages = async (
  publicIds: string[]
): Promise<PromiseSettledResult<any>[]> => {
  try {
    const deletePromises = publicIds.map((publicId) => deleteImage(publicId));
    const results = await Promise.allSettled(deletePromises);
    return results;
  } catch (error) {
    console.error("❌ Cloudinary multiple delete error:", error);
    throw new Error(`Failed to delete images: ${(error as Error).message}`);
  }
};

export { cloudinary };
