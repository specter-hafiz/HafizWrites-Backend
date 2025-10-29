"use strict";
/**
 * Image Resolvers
 * Handles image upload and deletion operations
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.imageResolvers = void 0;
const imageService = __importStar(require("../services/imageService"));
const auth_1 = require("../middleware/auth");
exports.imageResolvers = {
    Mutation: {
        /**
         * Upload an image to Cloudinary
         */
        uploadImage: async (_parent, args, context) => {
            (0, auth_1.requireAdmin)(context.user);
            return await imageService.uploadImage(args.imageData, args.folder);
        },
        /**
         * Delete an image from Cloudinary
         */
        deleteImage: async (_parent, args, context) => {
            (0, auth_1.requireAdmin)(context.user);
            await imageService.deleteImage(args.publicId);
            return {
                success: true,
                message: "Image deleted successfully",
            };
        },
    },
};
//# sourceMappingURL=imageResolvers.js.map