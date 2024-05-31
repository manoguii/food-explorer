"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvalidAttachmentTypeError = void 0;
class InvalidAttachmentTypeError extends Error {
    constructor(identifier) {
        super(`File type "${identifier}" is not valid.`);
    }
}
exports.InvalidAttachmentTypeError = InvalidAttachmentTypeError;
//# sourceMappingURL=invalid-attachment-type-error.js.map