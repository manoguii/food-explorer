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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StripeWebhookController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const stripe_webhook_1 = require("../../../domain/restaurant/application/webhooks/stripe-webhook");
const public_1 = require("../../auth/public");
const env_service_1 = require("../../env/env.service");
const stripe_service_1 = require("../../payment/stripe/stripe.service");
let StripeWebhookController = class StripeWebhookController {
    stripeWebhookUseCase;
    envService;
    stripeService;
    constructor(stripeWebhookUseCase, envService, stripeService) {
        this.stripeWebhookUseCase = stripeWebhookUseCase;
        this.envService = envService;
        this.stripeService = stripeService;
    }
    async handle(req) {
        let event;
        const signature = req.headers['stripe-signature'];
        try {
            event = this.stripeService.stripe.webhooks.constructEvent(req.rawBody, signature, this.envService.get('STRIPE_WEBHOOK_SECRET'));
        }
        catch (err) {
            throw new common_1.BadRequestException('Invalid Stripe webhook signature');
        }
        await this.stripeWebhookUseCase.execute({
            event,
        });
    }
};
exports.StripeWebhookController = StripeWebhookController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], StripeWebhookController.prototype, "handle", null);
exports.StripeWebhookController = StripeWebhookController = __decorate([
    (0, swagger_1.ApiTags)('Webhooks'),
    (0, common_1.Controller)('/webhook'),
    (0, public_1.Public)(),
    __metadata("design:paramtypes", [stripe_webhook_1.StripeWebhookUseCase,
        env_service_1.EnvService,
        stripe_service_1.StripeService])
], StripeWebhookController);
//# sourceMappingURL=stripe-webhook.controller.js.map