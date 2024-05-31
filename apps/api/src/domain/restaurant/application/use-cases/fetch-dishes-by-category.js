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
Object.defineProperty(exports, "__esModule", { value: true });
exports.FetchDishesByCategoryUseCase = void 0;
const common_1 = require("@nestjs/common");
const either_1 = require("../../../../core/either");
const category_repository_1 = require("../repositories/category-repository");
const dish_repository_1 = require("../repositories/dish-repository");
const favorite_dish_repository_1 = require("../repositories/favorite-dish-repository");
const invalid_category_error_1 = require("./errors/invalid-category-error");
let FetchDishesByCategoryUseCase = class FetchDishesByCategoryUseCase {
    dishRepository;
    categoryRepository;
    favoriteDishRepository;
    constructor(dishRepository, categoryRepository, favoriteDishRepository) {
        this.dishRepository = dishRepository;
        this.categoryRepository = categoryRepository;
        this.favoriteDishRepository = favoriteDishRepository;
    }
    async execute({ category, clientId, page, }) {
        const categoryEntity = await this.categoryRepository.findByName(category);
        if (!categoryEntity) {
            return (0, either_1.left)(new invalid_category_error_1.InvalidCategoryError(category));
        }
        const { dishes, totalPages } = await this.dishRepository.findManyByCategory(categoryEntity, {
            page,
        });
        const favoriteDishes = await this.favoriteDishRepository.findAllByClientId(clientId);
        dishes.forEach((dish) => {
            const isFavorite = favoriteDishes.some((favoriteDish) => favoriteDish.dishId.equals(dish.dishId));
            dish.isFavorite = isFavorite;
        });
        return (0, either_1.right)({
            dishes,
            totalPages,
        });
    }
};
exports.FetchDishesByCategoryUseCase = FetchDishesByCategoryUseCase;
exports.FetchDishesByCategoryUseCase = FetchDishesByCategoryUseCase = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [dish_repository_1.DishRepository,
        category_repository_1.CategoryRepository,
        favorite_dish_repository_1.FavoriteDishRepository])
], FetchDishesByCategoryUseCase);
//# sourceMappingURL=fetch-dishes-by-category.js.map