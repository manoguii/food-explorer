"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FailedToCreateACheckoutSessionError = void 0;
class FailedToCreateACheckoutSessionError extends Error {
    constructor(identifier) {
        super(`Failed to create a checkout session for cart ${identifier}`);
    }
}
exports.FailedToCreateACheckoutSessionError = FailedToCreateACheckoutSessionError;
//# sourceMappingURL=failed-to-create-a-checkout-session-error.js.map