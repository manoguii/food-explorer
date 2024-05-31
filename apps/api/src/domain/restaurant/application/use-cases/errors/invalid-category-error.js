"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvalidCategoryError = void 0;
class InvalidCategoryError extends Error {
    constructor(name) {
        super(`Category with name "${name}" does not exist !`);
    }
}
exports.InvalidCategoryError = InvalidCategoryError;
//# sourceMappingURL=invalid-category-error.js.map