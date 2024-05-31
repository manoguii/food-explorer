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
exports.DeleteDishController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const resource_not_found_error_1 = require("../../../core/errors/errors/resource-not-found-error");
const delete_dish_1 = require("../../../domain/restaurant/application/use-cases/delete-dish");
const roles_decorator_1 = require("../../auth/roles-decorator");
const roles_enum_1 = require("../../auth/roles-enum");
let DeleteDishController = class DeleteDishController {
    deleteDish;
    constructor(deleteDish) {
        this.deleteDish = deleteDish;
    }
    async handle(dishId) {
        const result = await this.deleteDish.execute({
            dishId,
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
exports.DeleteDishController = DeleteDishController;
__decorate([
    (0, roles_decorator_1.Roles)(roles_enum_1.Role.ADMIN),
    (0, common_1.Delete)(),
    __param(0, (0, common_1.Param)('dishId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], DeleteDishController.prototype, "handle", null);
exports.DeleteDishController = DeleteDishController = __decorate([
    (0, swagger_1.ApiTags)('Dish'),
    (0, common_1.Controller)('/dishes/:dishId'),
    __metadata("design:paramtypes", [delete_dish_1.DeleteDishUseCase])
], DeleteDishController);
//# sourceMappingURL=delete-dish.controller.js.map