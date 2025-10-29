/**
 * Image Service
 * Handles image upload and deletion via Cloudinary
 */
import { ICloudinaryUploadResponse } from "../types";
/**
 * Upload an image to Cloudinary
 */
export declare const uploadImage: (imageData: string, folder?: string) => Promise<ICloudinaryUploadResponse>;
/**
 * Delete an image from Cloudinary
 */
export declare const deleteImage: (publicId: string) => Promise<void>;
//# sourceMappingURL=imageService.d.ts.map