"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartPresenter = void 0;
class CartPresenter {
    static toHTTP(cart) {
        return {
            cartId: cart.id.toString(),
            clientId: cart.clientId.toString(),
            totalAmount: cart.totalAmount,
            createdAt: cart.createdAt,
            updatedAt: cart.updatedAt,
        };
    }
}
exports.CartPresenter = CartPresenter;
//# sourceMappingURL=cart-presenter.js.map