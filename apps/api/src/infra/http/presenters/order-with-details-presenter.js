"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderWithDetailsPresenter = void 0;
class OrderWithDetailsPresenter {
    static toHTTP(order) {
        return {
            orderId: order.orderId.toString(),
            clientId: order.clientId.toString(),
            code: order.code,
            currency: order.currency,
            amountTotal: order.amountTotal,
            paymentMethod: order.paymentMethod,
            paymentStatus: order.paymentStatus,
            status: order.status,
            priority: order.priority,
            label: order.label,
            createdAt: order.createdAt,
            updatedAt: order.updatedAt,
            cart: {
                totalAmount: order.cart.totalAmount,
                createdAt: order.cart.createdAt,
                updatedAt: order.cart.updatedAt,
                cartItems: order.cart.cartItems.map((cartItem) => ({
                    id: cartItem.id.toString(),
                    name: cartItem.name,
                    description: cartItem.description,
                    price: cartItem.price,
                    slug: cartItem.slug,
                    quantity: cartItem.quantity,
                    ingredients: cartItem.ingredients,
                    attachments: cartItem.attachments,
                })),
            },
        };
    }
}
exports.OrderWithDetailsPresenter = OrderWithDetailsPresenter;
//# sourceMappingURL=order-with-details-presenter.js.map