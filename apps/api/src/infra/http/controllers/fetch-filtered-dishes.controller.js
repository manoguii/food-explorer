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
exports.FetchFilteredDishesController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const zod_1 = require("zod");
const fetch_filtered_dishes_1 = require("../../../domain/restaurant/application/use-cases/fetch-filtered-dishes");
const current_user_decorator_1 = require("../../auth/current-user-decorator");
const zod_validation_pipe_1 = require("../pipes/zod-validation-pipe");
const dish_with_details_presenter_1 = require("../presenters/dish-with-details-presenter");
const searchParamsSchema = zod_1.z.object({
    page: zod_1.z
        .string()
        .optional()
        .default('1')
        .transform(Number)
        .pipe(zod_1.z.number().min(1)),
    query: zod_1.z.string().optional().default(''),
});
const searchParamsValidationPipe = new zod_validation_pipe_1.ZodValidationPipe(searchParamsSchema);
let FetchFilteredDishesController = class FetchFilteredDishesController {
    fetchFilteredDishes;
    constructor(fetchFilteredDishes) {
        this.fetchFilteredDishes = fetchFilteredDishes;
    }
    async handle(user, searchParams) {
        const { page, query } = searchParams;
        const result = await this.fetchFilteredDishes.execute({
            page,
            query,
            clientId: user.sub,
        });
        if (result.isLeft()) {
            throw new common_1.BadRequestException();
        }
        const dishes = result.value.dishes;
        const totalPages = result.value.totalPages;
        return {
            dishes: dishes.map(dish_with_details_presenter_1.DishWithDetailsPresenter.toHTTP),
            totalPages,
        };
    }
};
exports.FetchFilteredDishesController = FetchFilteredDishesController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)(searchParamsValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], FetchFilteredDishesController.prototype, "handle", null);
exports.FetchFilteredDishesController = FetchFilteredDishesController = __decorate([
    (0, swagger_1.ApiTags)('Dish'),
    (0, common_1.Controller)('/dishes'),
    __metadata("design:paramtypes", [fetch_filtered_dishes_1.FetchFilteredDishesUseCase])
], FetchFilteredDishesController);
//# sourceMappingURL=fetch-filtered-dishes.controller.js.map