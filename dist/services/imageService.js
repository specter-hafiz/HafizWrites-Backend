"use strict";
/**
 * Image Service
 * Handles image upload and deletion via Cloudinary
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteImage = exports.uploadImage = void 0;
const cloudinary_1 = require("../config/cloudinary");
/**
 * Upload an image to Cloudinary
 */
const uploadImage = async (imageData, folder) => {
    try {
        // Validate base64 format
        if (!imageData.startsWith("data:image")) {
            throw new Error("Invalid image format. Must be base64 encoded image.");
        }
        console.log("Uploading image to Cloudinary...");
        console.log("Image data" + imageData);
        const result = await (0, cloudinary_1.uploadImage)(imageData, folder || "blog-images");
        return {
            url: result.url,
            publicId: result.publicId,
            message: "Image uploaded successfully",
        };
    }
    catch (error) {
        throw new Error(`Failed to upload image: ${error.message}`);
    }
};
exports.uploadImage = uploadImage;
/**
 * Delete an image from Cloudinary
 */
const deleteImage = async (publicId) => {
    try {
        await (0, cloudinary_1.deleteImage)(publicId);
    }
    catch (error) {
        throw new Error(`Failed to delete image: ${error.message}`);
    }
};
exports.deleteImage = deleteImage;
//# sourceMappingURL=imageService.js.map