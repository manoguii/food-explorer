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
exports.CreateCheckoutSessionUseCase = void 0;
const common_1 = require("@nestjs/common");
const either_1 = require("../../../../core/either");
const resource_not_found_error_1 = require("../../../../core/errors/errors/resource-not-found-error");
const stripe_repository_1 = require("../payment/stripe-repository");
const cart_repository_1 = require("../repositories/cart-repository");
const failed_to_create_a_checkout_session_error_1 = require("./errors/failed-to-create-a-checkout-session-error");
let CreateCheckoutSessionUseCase = class CreateCheckoutSessionUseCase {
    cartRepository;
    paymentStripeRepository;
    constructor(cartRepository, paymentStripeRepository) {
        this.cartRepository = cartRepository;
        this.paymentStripeRepository = paymentStripeRepository;
    }
    async execute({ cartId, }) {
        const cart = await this.cartRepository.findByIdWithDetails(cartId);
        if (!cart) {
            return (0, either_1.left)(new resource_not_found_error_1.ResourceNotFoundError());
        }
        const checkoutSessionUrl = await this.paymentStripeRepository.createCheckoutSession(cart);
        if (!checkoutSessionUrl) {
            return (0, either_1.left)(new failed_to_create_a_checkout_session_error_1.FailedToCreateACheckoutSessionError(cart.cartId.toString()));
        }
        return (0, either_1.right)({
            checkoutSessionUrl,
        });
    }
};
exports.CreateCheckoutSessionUseCase = CreateCheckoutSessionUseCase;
exports.CreateCheckoutSessionUseCase = CreateCheckoutSessionUseCase = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [cart_repository_1.CartRepository,
        stripe_repository_1.StripeRepository])
], CreateCheckoutSessionUseCase);
//# sourceMappingURL=create-checkout-session.js.map