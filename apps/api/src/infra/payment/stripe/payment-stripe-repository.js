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
exports.PaymentStripeRepository = void 0;
const common_1 = require("@nestjs/common");
const env_service_1 = require("../../env/env.service");
const stripe_service_1 = require("./stripe.service");
let PaymentStripeRepository = class PaymentStripeRepository {
    stripeService;
    envService;
    constructor(stripeService, envService) {
        this.stripeService = stripeService;
        this.envService = envService;
    }
    async createCheckoutSession(cart) {
        const session = await this.stripeService.stripe.checkout.sessions.create({
            mode: 'payment',
            payment_method_types: ['card'],
            success_url: this.envService.get('STRIPE_SUCCESS_URL'),
            cancel_url: this.envService.get('STRIPE_CANCEL_URL'),
            client_reference_id: cart.cartId.toString(),
            line_items: cart.dishes.map((dish) => ({
                quantity: dish.quantity,
                price_data: {
                    unit_amount: dish.price * 100,
                    currency: 'brl',
                    product_data: {
                        name: dish.name,
                        description: dish.description,
                        images: dish.attachments.map((attachment) => {
                            const imageUrl = `${this.envService.get('CLOUDFLARE_BASE_URL')}/${attachment.url}`;
                            return imageUrl;
                        }),
                    },
                },
            })),
        });
        return session.url;
    }
};
exports.PaymentStripeRepository = PaymentStripeRepository;
exports.PaymentStripeRepository = PaymentStripeRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [stripe_service_1.StripeService,
        env_service_1.EnvService])
], PaymentStripeRepository);
//# sourceMappingURL=payment-stripe-repository.js.map