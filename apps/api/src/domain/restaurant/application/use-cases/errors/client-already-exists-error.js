"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientAlreadyExistsError = void 0;
class ClientAlreadyExistsError extends Error {
    constructor(identifier) {
        super(`Client "${identifier}" already exists.`);
    }
}
exports.ClientAlreadyExistsError = ClientAlreadyExistsError;
//# sourceMappingURL=client-already-exists-error.js.map