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
exports.DeleteDishFromFavoritesController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const resource_not_found_error_1 = require("../../../core/errors/errors/resource-not-found-error");
const delete_dish_from_favorites_1 = require("../../../domain/restaurant/application/use-cases/delete-dish-from-favorites");
const current_user_decorator_1 = require("../../auth/current-user-decorator");
let DeleteDishFromFavoritesController = class DeleteDishFromFavoritesController {
    deleteDishFromFavorites;
    constructor(deleteDishFromFavorites) {
        this.deleteDishFromFavorites = deleteDishFromFavorites;
    }
    async handle(user, dishId) {
        const result = await this.deleteDishFromFavorites.execute({
            dishId,
            clientId: user.sub,
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
exports.DeleteDishFromFavoritesController = DeleteDishFromFavoritesController;
__decorate([
    (0, common_1.Delete)(),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('dishId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], DeleteDishFromFavoritesController.prototype, "handle", null);
exports.DeleteDishFromFavoritesController = DeleteDishFromFavoritesController = __decorate([
    (0, swagger_1.ApiTags)('Dish'),
    (0, common_1.Controller)('/dishes/:dishId/favorite'),
    __metadata("design:paramtypes", [delete_dish_from_favorites_1.DeleteDishFromFavoritesUseCase])
], DeleteDishFromFavoritesController);
//# sourceMappingURL=delete-dish-from-favorites.controller.js.map