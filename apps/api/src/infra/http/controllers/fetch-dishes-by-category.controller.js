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
exports.FetchDishesByCategoryController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const zod_1 = require("zod");
const invalid_category_error_1 = require("../../../domain/restaurant/application/use-cases/errors/invalid-category-error");
const fetch_dishes_by_category_1 = require("../../../domain/restaurant/application/use-cases/fetch-dishes-by-category");
const current_user_decorator_1 = require("../../auth/current-user-decorator");
const zod_validation_pipe_1 = require("../pipes/zod-validation-pipe");
const dish_with_details_presenter_1 = require("../presenters/dish-with-details-presenter");
const queryParamSchema = zod_1.z.object({
    page: zod_1.z
        .string()
        .optional()
        .default('1')
        .transform(Number)
        .pipe(zod_1.z.number().min(1)),
});
const queryValidationPipe = new zod_validation_pipe_1.ZodValidationPipe(queryParamSchema);
let FetchDishesByCategoryController = class FetchDishesByCategoryController {
    fetchDishesByCategories;
    constructor(fetchDishesByCategories) {
        this.fetchDishesByCategories = fetchDishesByCategories;
    }
    async handle(user, category, query) {
        const { page } = query;
        const result = await this.fetchDishesByCategories.execute({
            category,
            clientId: user.sub,
            page,
        });
        if (result.isLeft()) {
            const error = result.value;
            switch (error.constructor) {
                case invalid_category_error_1.InvalidCategoryError:
                    throw new common_1.NotFoundException(error.message);
                default:
                    throw new common_1.BadRequestException(error.message);
            }
        }
        const dishes = result.value.dishes;
        const totalPages = result.value.totalPages;
        return {
            dishes: dishes.map(dish_with_details_presenter_1.DishWithDetailsPresenter.toHTTP),
            totalPages,
        };
    }
};
exports.FetchDishesByCategoryController = FetchDishesByCategoryController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('category')),
    __param(2, (0, common_1.Query)(queryValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], FetchDishesByCategoryController.prototype, "handle", null);
exports.FetchDishesByCategoryController = FetchDishesByCategoryController = __decorate([
    (0, swagger_1.ApiTags)('Dish'),
    (0, common_1.Controller)('/dish/:category'),
    __metadata("design:paramtypes", [fetch_dishes_by_category_1.FetchDishesByCategoryUseCase])
], FetchDishesByCategoryController);
//# sourceMappingURL=fetch-dishes-by-category.controller.js.map