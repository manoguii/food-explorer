"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StripeWebhookUseCase = void 0;
const common_1 = require("@nestjs/common");
const either_1 = require("../../../../core/either");
const unique_entity_id_1 = require("../../../../core/entities/unique-entity-id");
const order_1 = require("../../enterprise/entities/order");
const webhook_event_1 = require("../../enterprise/entities/webhook-event");
const webhook_event_2 = require("../payment/webhook-event");
const cart_repository_1 = require("../repositories/cart-repository");
const orders_repository_1 = require("../repositories/orders-repository");
const cart_id_not_provided_error_1 = require("./errors/cart-id-not-provided-error");
const cart_not_found_error_1 = require("./errors/cart-not-found-error");
let StripeWebhookUseCase = class StripeWebhookUseCase {
    cartRepository;
    webhookEventRepository;
    ordersRepository;
    constructor(cartRepository, webhookEventRepository, ordersRepository) {
        this.cartRepository = cartRepository;
        this.webhookEventRepository = webhookEventRepository;
        this.ordersRepository = ordersRepository;
    }
    async execute({ event, }) {
        if (event.type === 'checkout.session.completed') {
            if (!event.data.object.client_reference_id) {
                return (0, either_1.left)(new cart_id_not_provided_error_1.CartIdNotProvidedError());
            }
            const cart = await this.cartRepository.findById(event.data.object.client_reference_id);
            if (!cart) {
                return (0, either_1.left)(new cart_not_found_error_1.CartNotFoundError());
            }
            const order = order_1.Order.create({
                clientId: cart.clientId,
                cartId: new unique_entity_id_1.UniqueEntityID(event.data.object.client_reference_id),
                sessionId: new unique_entity_id_1.UniqueEntityID(event.data.object.id),
                currency: event.data.object.currency ?? 'brl',
                paymentMethod: event.data.object.payment_method_types[0],
                amountTotal: event.data.object.amount_total
                    ? event.data.object.amount_total / 100
                    : cart.totalAmount,
                paymentStatus: event.data.object.payment_status.toLocaleUpperCase(),
            });
            await this.ordersRepository.create(order);
        }
        const webhookEvent = webhook_event_1.WebhookEvent.create({
            type: event.type,
            data: event,
        });
        await this.webhookEventRepository.create(webhookEvent);
        return (0, either_1.right)(null);
    }
};
exports.StripeWebhookUseCase = StripeWebhookUseCase;
exports.StripeWebhookUseCase = StripeWebhookUseCase = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [cart_repository_1.CartRepository,
        webhook_event_2.WebhookEventRepository,
        orders_repository_1.OrdersRepository])
], StripeWebhookUseCase);
//# sourceMappingURL=stripe-webhook.js.map