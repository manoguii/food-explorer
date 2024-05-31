"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Order = void 0;
const node_crypto_1 = require("node:crypto");
const entity_1 = require("../../../../core/entities/entity");
class Order extends entity_1.Entity {
    get clientId() {
        return this.props.clientId;
    }
    get cartId() {
        return this.props.cartId;
    }
    get sessionId() {
        return this.props.sessionId;
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
    set paymentStatus(paymentStatus) {
        this.props.paymentStatus = paymentStatus;
        this.touch();
    }
    get label() {
        return this.props.label;
    }
    set label(label) {
        this.props.label = label;
        this.touch();
    }
    get priority() {
        return this.props.priority;
    }
    set priority(priority) {
        this.props.priority = priority;
        this.touch();
    }
    get status() {
        return this.props.status;
    }
    set status(status) {
        this.props.status = status;
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
        const order = new Order({
            ...props,
            code: props.code ?? (0, node_crypto_1.randomUUID)(),
            label: props.label ?? 'TABLE',
            status: props.status ?? 'PENDING',
            priority: props.priority ?? 'LOW',
            createdAt: props.createdAt ?? new Date(),
        }, id);
        return order;
    }
}
exports.Order = Order;
//# sourceMappingURL=order.js.map