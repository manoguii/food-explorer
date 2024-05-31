"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderWithDetails = void 0;
const value_object_1 = require("../../../../../core/entities/value-object");
class OrderWithDetails extends value_object_1.ValueObject {
    get orderId() {
        return this.props.orderId;
    }
    get clientId() {
        return this.props.clientId;
    }
    get code() {
        return this.props.code;
    }
    get currency() {
        return this.props.currency;
    }
    get amountTotal() {
        return this.props.amountTotal;
    }
    get paymentMethod() {
        return this.props.paymentMethod;
    }
    get paymentStatus() {
        return this.props.paymentStatus;
    }
    get status() {
        return this.props.status;
    }
    get priority() {
        return this.props.priority;
    }
    get label() {
        return this.props.label;
    }
    get createdAt() {
        return this.props.createdAt;
    }
    get updatedAt() {
        return this.props.updatedAt;
    }
    get cart() {
        return this.props.cart;
    }
    static create(props) {
        return new OrderWithDetails(props);
    }
}
exports.OrderWithDetails = OrderWithDetails;
//# sourceMappingURL=order-with-details.js.map