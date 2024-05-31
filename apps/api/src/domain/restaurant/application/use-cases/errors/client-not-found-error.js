"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientNotFoundError = void 0;
class ClientNotFoundError extends Error {
    constructor(identifier) {
        super(`Client "${identifier}" not found.`);
    }
}
exports.ClientNotFoundError = ClientNotFoundError;
//# sourceMappingURL=client-not-found-error.js.map