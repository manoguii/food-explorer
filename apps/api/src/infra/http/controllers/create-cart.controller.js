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
exports.CreateCartController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const create_cart_1 = require("../../../domain/restaurant/application/use-cases/create-cart");
const current_user_decorator_1 = require("../../auth/current-user-decorator");
const cart_presenter_1 = require("../presenters/cart-presenter");
let CreateCartController = class CreateCartController {
    createCart;
    constructor(createCart) {
        this.createCart = createCart;
    }
    async handle(user) {
        const result = await this.createCart.execute({
            clientId: user.sub,
        });
        if (result.isLeft()) {
            throw new common_1.BadRequestException();
        }
        const cart = result.value.cart;
        return { cart: cart_presenter_1.CartPresenter.toHTTP(cart) };
    }
};
exports.CreateCartController = CreateCartController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CreateCartController.prototype, "handle", null);
exports.CreateCartController = CreateCartController = __decorate([
    (0, swagger_1.ApiTags)('Carts'),
    (0, common_1.Controller)('/cart'),
    __metadata("design:paramtypes", [create_cart_1.CreateCartUseCase])
], CreateCartController);
//# sourceMappingURL=create-cart.controller.js.map