"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const stripe_repository_1 = require("../../domain/restaurant/application/payment/stripe-repository");
const env_module_1 = require("../env/env.module");
const payment_stripe_repository_1 = require("./stripe/payment-stripe-repository");
const stripe_module_definition_1 = require("./stripe/stripe.module-definition");
const stripe_service_1 = require("./stripe/stripe.service");
let PaymentModule = class PaymentModule extends stripe_module_definition_1.ConfigurableModuleClass {
};
exports.PaymentModule = PaymentModule;
exports.PaymentModule = PaymentModule = __decorate([
    (0, common_1.Module)({
        imports: [config_1.ConfigModule, env_module_1.EnvModule],
        providers: [
            stripe_service_1.StripeService,
            {
                provide: stripe_repository_1.StripeRepository,
                useClass: payment_stripe_repository_1.PaymentStripeRepository,
            },
            {
                provide: stripe_module_definition_1.MODULE_OPTIONS_TOKEN,
                useValue: stripe_module_definition_1.ConfigurableModuleClass,
            },
        ],
        exports: [stripe_service_1.StripeService, stripe_repository_1.StripeRepository],
    })
], PaymentModule);
//# sourceMappingURL=payment.module.js.map