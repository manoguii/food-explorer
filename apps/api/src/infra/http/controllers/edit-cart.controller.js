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
exports.EditCartController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const zod_1 = require("zod");
const resource_not_found_error_1 = require("../../../core/errors/errors/resource-not-found-error");
const edit_cart_1 = require("../../../domain/restaurant/application/use-cases/edit-cart");
const zod_validation_pipe_1 = require("../pipes/zod-validation-pipe");
const EditCartBodySchema = zod_1.z.object({
    item: zod_1.z.object({
        dishId: zod_1.z.string(),
        quantity: zod_1.z.number(),
    }),
});
const bodyValidationPipe = new zod_validation_pipe_1.ZodValidationPipe(EditCartBodySchema);
let EditCartController = class EditCartController {
    EditCart;
    constructor(EditCart) {
        this.EditCart = EditCart;
    }
    async handle(body, cartId) {
        const { item } = body;
        const result = await this.EditCart.execute({
            cartId,
            dish: item,
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
exports.EditCartController = EditCartController;
__decorate([
    (0, common_1.Put)(),
    __param(0, (0, common_1.Body)(bodyValidationPipe)),
    __param(1, (0, common_1.Param)('cartId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], EditCartController.prototype, "handle", null);
exports.EditCartController = EditCartController = __decorate([
    (0, swagger_1.ApiTags)('Carts'),
    (0, common_1.Controller)('/cart/:cartId'),
    __metadata("design:paramtypes", [edit_cart_1.EditCartUseCase])
], EditCartController);
//# sourceMappingURL=edit-cart.controller.js.map