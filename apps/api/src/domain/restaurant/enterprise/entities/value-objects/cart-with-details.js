"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartWithDetails = void 0;
const value_object_1 = require("../../../../../core/entities/value-object");
class CartWithDetails extends value_object_1.ValueObject {
    get cartId() {
        return this.props.cartId;
    }
    get totalAmount() {
        return this.props.totalAmount;
    }
    get dishes() {
        return this.props.dishes;
    }
    get client() {
        return this.props.client;
    }
    get createdAt() {
        return this.props.createdAt;
    }
    get updatedAt() {
        return this.props.updatedAt;
    }
    static create(props) {
        return new CartWithDetails(props);
    }
}
exports.CartWithDetails = CartWithDetails;
//# sourceMappingURL=cart-with-details.js.map