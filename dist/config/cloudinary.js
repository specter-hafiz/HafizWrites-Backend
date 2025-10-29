"use strict";
/**
 * Cloudinary Configuration
 * Sets up Cloudinary for image upload and management
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.cloudinary = exports.deleteMultipleImages = exports.deleteImage = exports.uploadImage = void 0;
const cloudinary_1 = require("cloudinary");
Object.defineProperty(exports, "cloudinary", { enumerable: true, get: function () { return cloudinary_1.v2; } });
/**
 * Validate Cloudinary configuration
 */
const validateConfig = () => {
    if (!process.env.CLOUDINARY_CLOUD_NAME ||
        !process.env.CLOUDINARY_API_KEY ||
        !process.env.CLOUDINARY_API_SECRET) {
        throw new Error("Cloudinary configuration is incomplete. Please check your .env file.");
    }
};
// Validate before configuring
validateConfig();
// Configure Cloudinary with explicit credentials
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
});
// Log configuration status (without exposing secrets)
console.log("🔧 Cloudinary Configuration:");
console.log(`   Cloud Name: ${process.env.CLOUDINARY_CLOUD_NAME}`);
console.log(`   API Key: ${process.env.CLOUDINARY_API_KEY?.substring(0, 4)}...`);
console.log(`   API Secret: ${process.env.CLOUDINARY_API_SECRET ? "***configured***" : "❌ missing"}`);
/**
 * Upload image to Cloudinary
 * @param {string} fileBuffer - Base64 encoded image or file path
 * @param {string} folder - Folder name in Cloudinary
 * @returns {Promise<IImageUploadResult>} - Cloudinary upload result
 */
const uploadImage = async (fileBuffer, folder = "blog-images") => {
    try {
        console.log("📤 Starting Cloudinary upload...");
        console.log(`   Folder: ${folder}`);
        console.log(`   Image data length: ${fileBuffer.length}`);
        // Ensure config is set
        validateConfig();
        // Upload with explicit configuration
        const result = await cloudinary_1.v2.uploader.upload(fileBuffer, {
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
        });
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
    }
    catch (error) {
        console.error("❌ Cloudinary upload error:", error);
        // More detailed error logging
        if (error instanceof Error) {
            console.error("   Error message:", error.message);
            console.error("   Error stack:", error.stack);
        }
        // Check configuration again
        console.error("   Current config check:");
        console.error(`   Cloud Name: ${process.env.CLOUDINARY_CLOUD_NAME || "❌ missing"}`);
        console.error(`   API Key: ${process.env.CLOUDINARY_API_KEY || "❌ missing"}`);
        console.error(`   API Secret: ${process.env.CLOUDINARY_API_SECRET ? "***set***" : "❌ missing"}`);
        throw new Error(`Failed to upload image: ${error.message}`);
    }
};
exports.uploadImage = uploadImage;
/**
 * Delete image from Cloudinary
 * @param {string} publicId - Public ID of the image to delete
 * @returns {Promise<any>} - Deletion result
 */
const deleteImage = async (publicId) => {
    try {
        console.log(`🗑️ Deleting image from Cloudinary: ${publicId}`);
        const result = await cloudinary_1.v2.uploader.destroy(publicId, {
            resource_type: "image",
        });
        if (result.result !== "ok" && result.result !== "not found") {
            throw new Error(`Deletion failed: ${result.result}`);
        }
        console.log("✅ Image deleted successfully");
        return result;
    }
    catch (error) {
        console.error("❌ Cloudinary delete error:", error);
        throw new Error(`Failed to delete image: ${error.message}`);
    }
};
exports.deleteImage = deleteImage;
/**
 * Delete multiple images from Cloudinary
 * @param {string[]} publicIds - Array of public IDs to delete
 * @returns {Promise<PromiseSettledResult<any>[]>} - Deletion results
 */
const deleteMultipleImages = async (publicIds) => {
    try {
        const deletePromises = publicIds.map((publicId) => (0, exports.deleteImage)(publicId));
        const results = await Promise.allSettled(deletePromises);
        return results;
    }
    catch (error) {
        console.error("❌ Cloudinary multiple delete error:", error);
        throw new Error(`Failed to delete images: ${error.message}`);
    }
};
exports.deleteMultipleImages = deleteMultipleImages;
//# sourceMappingURL=cloudinary.js.map