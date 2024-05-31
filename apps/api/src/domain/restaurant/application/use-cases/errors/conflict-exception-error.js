"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConflictExceptionError = void 0;
class ConflictExceptionError extends Error {
    constructor(identifier) {
        super(`Item with identifier ${identifier} already exists`);
    }
}
exports.ConflictExceptionError = ConflictExceptionError;
//# sourceMappingURL=conflict-exception-error.js.map