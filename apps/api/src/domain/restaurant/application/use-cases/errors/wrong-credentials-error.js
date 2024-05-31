"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WrongCredentialsError = void 0;
class WrongCredentialsError extends Error {
    constructor() {
        super(`Credentials are not valid.`);
    }
}
exports.WrongCredentialsError = WrongCredentialsError;
//# sourceMappingURL=wrong-credentials-error.js.map