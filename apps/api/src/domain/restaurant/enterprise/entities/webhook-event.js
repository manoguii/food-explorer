"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebhookEvent = void 0;
const entity_1 = require("../../../../core/entities/entity");
class WebhookEvent extends entity_1.Entity {
    get type() {
        return this.props.type;
    }
    get data() {
        return this.props.data;
    }
    get createdAt() {
        return this.props.createdAt;
    }
    static create(props, id) {
        const webhookEvent = new WebhookEvent({
            ...props,
            createdAt: props.createdAt ?? new Date(),
        }, id);
        return webhookEvent;
    }
}
exports.WebhookEvent = WebhookEvent;
//# sourceMappingURL=webhook-event.js.map