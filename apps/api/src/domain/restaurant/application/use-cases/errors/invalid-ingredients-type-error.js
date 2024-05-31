"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvalidIngredientsTypeError = void 0;
class InvalidIngredientsTypeError extends Error {
    constructor() {
        super(`Dish must have at least one ingredient.`);
    }
}
exports.InvalidIngredientsTypeError = InvalidIngredientsTypeError;
//# sourceMappingURL=invalid-ingredients-type-error.js.map