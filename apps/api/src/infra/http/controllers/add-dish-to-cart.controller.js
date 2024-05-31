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
exports.AddDishToCartController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const zod_1 = require("zod");
const resource_not_found_error_1 = require("../../../core/errors/errors/resource-not-found-error");
const add_dish_to_cart_1 = require("../../../domain/restaurant/application/use-cases/add-dish-to-cart");
const zod_validation_pipe_1 = require("../pipes/zod-validation-pipe");
const addDishToCartBodySchema = zod_1.z.object({
    dishId: zod_1.z.string(),
    quantity: zod_1.z.number(),
});
const bodyValidationPipe = new zod_validation_pipe_1.ZodValidationPipe(addDishToCartBodySchema);
let AddDishToCartController = class AddDishToCartController {
    addDishToCart;
    constructor(addDishToCart) {
        this.addDishToCart = addDishToCart;
    }
    async handle(body, cartId) {
        const { dishId, quantity } = body;
        const result = await this.addDishToCart.execute({
            cartId,
            dishId,
            quantity,
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
    }
};
exports.AddDishToCartController = AddDishToCartController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)(bodyValidationPipe)),
    __param(1, (0, common_1.Param)('cartId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], AddDishToCartController.prototype, "handle", null);
exports.AddDishToCartController = AddDishToCartController = __decorate([
    (0, swagger_1.ApiTags)('Carts'),
    (0, common_1.Controller)('/cart/:cartId'),
    __metadata("design:paramtypes", [add_dish_to_cart_1.AddDishToCartUseCase])
], AddDishToCartController);
//# sourceMappingURL=add-dish-to-cart.controller.js.map