"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cart = void 0;
const aggregate_root_1 = require("../../../../core/entities/aggregate-root");
const cart_item_list_1 = require("./cart-item-list");
class Cart extends aggregate_root_1.AggregateRoot {
    get clientId() {
        return this.props.clientId;
    }
    get totalAmount() {
        return this.props.totalAmount;
    }
    set totalAmount(totalAmount) {
        this.props.totalAmount = totalAmount;
        this.touch();
    }
    get items() {
        return this.props.items;
    }
    set items(items) {
        this.props.items = items;
        this.touch();
    }
    get createdAt() {
        return this.props.createdAt;
    }
    get updatedAt() {
        return this.props.updatedAt;
    }
    touch() {
        this.props.updatedAt = new Date();
    }
    static create(props, id) {
        const cart = new Cart({
            ...props,
            items: props.items ?? new cart_item_list_1.CartItemList(),
            createdAt: props.createdAt ?? new Date(),
            totalAmount: props.totalAmount ?? 0,
        }, id);
        return cart;
    }
}
exports.Cart = Cart;
//# sourceMappingURL=cart.js.map