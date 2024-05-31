"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartItem = void 0;
const entity_1 = require("../../../../core/entities/entity");
class CartItem extends entity_1.Entity {
    get cartId() {
        return this.props.cartId;
    }
    get dishId() {
        return this.props.dishId;
    }
    get quantity() {
        return this.props.quantity;
    }
    set quantity(quantity) {
        this.props.quantity = quantity;
        this.touch();
    }
    get cost() {
        return this.props.cost;
    }
    set cost(cost) {
        this.props.cost = cost;
        this.touch();
    }
    get updatedAt() {
        return this.props.updatedAt;
    }
    touch() {
        this.props.updatedAt = new Date();
    }
    static create(props, id) {
        const cartItem = new CartItem({
            ...props,
        }, id);
        return cartItem;
    }
}
exports.CartItem = CartItem;
//# sourceMappingURL=cart-item.js.map