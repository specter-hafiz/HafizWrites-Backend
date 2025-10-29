"use strict";
/**
 * Root Resolvers
 * Combines all resolvers from different modules
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolvers = void 0;
const authResolvers_1 = require("./authResolvers");
const blogResolvers_1 = require("./blogResolvers");
const imageResolvers_1 = require("./imageResolvers");
/**
 * Merge all resolvers
 */
exports.resolvers = {
    Query: {
        ...authResolvers_1.authResolvers.Query,
        ...blogResolvers_1.blogResolvers.Query,
    },
    Mutation: {
        ...authResolvers_1.authResolvers.Mutation,
        ...blogResolvers_1.blogResolvers.Mutation,
        ...imageResolvers_1.imageResolvers.Mutation,
    },
};
//# sourceMappingURL=index.js.map