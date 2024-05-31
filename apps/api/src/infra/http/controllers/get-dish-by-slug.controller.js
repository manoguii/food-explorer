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
exports.GetDishBySlugController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const resource_not_found_error_1 = require("../../../core/errors/errors/resource-not-found-error");
const get_dish_by_slug_1 = require("../../../domain/restaurant/application/use-cases/get-dish-by-slug");
const dish_with_details_presenter_1 = require("../presenters/dish-with-details-presenter");
let GetDishBySlugController = class GetDishBySlugController {
    getDishBySlug;
    constructor(getDishBySlug) {
        this.getDishBySlug = getDishBySlug;
    }
    async handle(slug) {
        const result = await this.getDishBySlug.execute({
            slug,
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
        const dish = result.value.dish;
        return { dish: dish_with_details_presenter_1.DishWithDetailsPresenter.toHTTP(dish) };
    }
};
exports.GetDishBySlugController = GetDishBySlugController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Param)('slug')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], GetDishBySlugController.prototype, "handle", null);
exports.GetDishBySlugController = GetDishBySlugController = __decorate([
    (0, swagger_1.ApiTags)('Dish'),
    (0, common_1.Controller)('/dishes/:slug'),
    __metadata("design:paramtypes", [get_dish_by_slug_1.GetDishBySlugUseCase])
], GetDishBySlugController);
//# sourceMappingURL=get-dish-by-slug.controller.js.map