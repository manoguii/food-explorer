"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvalidPriceError = void 0;
class InvalidPriceError extends Error {
    constructor() {
        super(`Price must be a valid number.`);
    }
}
exports.InvalidPriceError = InvalidPriceError;
//# sourceMappingURL=invalid-price-error.js.map