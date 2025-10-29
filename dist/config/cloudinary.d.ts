/**
 * Cloudinary Configuration
 * Sets up Cloudinary for image upload and management
 */
import { v2 as cloudinary } from "cloudinary";
import { IImageUploadResult } from "../types";
/**
 * Upload image to Cloudinary
 * @param {string} fileBuffer - Base64 encoded image or file path
 * @param {string} folder - Folder name in Cloudinary
 * @returns {Promise<IImageUploadResult>} - Cloudinary upload result
 */
export declare const uploadImage: (fileBuffer: string, folder?: string) => Promise<IImageUploadResult>;
/**
 * Delete image from Cloudinary
 * @param {string} publicId - Public ID of the image to delete
 * @returns {Promise<any>} - Deletion result
 */
export declare const deleteImage: (publicId: string) => Promise<any>;
/**
 * Delete multiple images from Cloudinary
 * @param {string[]} publicIds - Array of public IDs to delete
 * @returns {Promise<PromiseSettledResult<any>[]>} - Deletion results
 */
export declare const deleteMultipleImages: (publicIds: string[]) => Promise<PromiseSettledResult<any>[]>;
export { cloudinary };
//# sourceMappingURL=cloudinary.d.ts.map