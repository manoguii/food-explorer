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
exports.GetCartByIdController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const resource_not_found_error_1 = require("../../../core/errors/errors/resource-not-found-error");
const get_cart_by_id_1 = require("../../../domain/restaurant/application/use-cases/get-cart-by-id");
const cart_with_details_presenter_1 = require("../presenters/cart-with-details-presenter");
let GetCartByIdController = class GetCartByIdController {
    getCartById;
    constructor(getCartById) {
        this.getCartById = getCartById;
    }
    async handle(id) {
        const result = await this.getCartById.execute({
            cartId: id,
        });
        if (result.isLeft()) {
            const error = result.value;
            switch (error.constructor) {
                case resource_not_found_error_1.ResourceNotFoundError:
                    throw new common_1.NotFoundException(error.message);
                default:
                    throw new common_1.BadRequestException(error.message);
            }
        }
        const cart = result.value.cart;
        return { cart: cart_with_details_presenter_1.CartWithDetailsPresenter.toHTTP(cart) };
    }
};
exports.GetCartByIdController = GetCartByIdController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], GetCartByIdController.prototype, "handle", null);
exports.GetCartByIdController = GetCartByIdController = __decorate([
    (0, swagger_1.ApiTags)('Cart'),
    (0, common_1.Controller)('/cart/:id'),
    __metadata("design:paramtypes", [get_cart_by_id_1.GetCartByIdUseCase])
], GetCartByIdController);
//# sourceMappingURL=get-cart-by-id.controller.js.map