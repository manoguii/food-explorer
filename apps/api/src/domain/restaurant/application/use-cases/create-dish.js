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
exports.CreateDishUseCase = void 0;
const common_1 = require("@nestjs/common");
const either_1 = require("../../../../core/either");
const unique_entity_id_1 = require("../../../../core/entities/unique-entity-id");
const dish_1 = require("../../enterprise/entities/dish");
const dish_attachment_1 = require("../../enterprise/entities/dish-attachment");
const dish_attachment_list_1 = require("../../enterprise/entities/dish-attachment-list");
const dish_ingredient_1 = require("../../enterprise/entities/dish-ingredient");
const dish_ingredient_list_1 = require("../../enterprise/entities/dish-ingredient-list");
const ingredient_1 = require("../../enterprise/entities/ingredient");
const price_1 = require("../../enterprise/entities/value-objects/price");
const dish_repository_1 = require("../repositories/dish-repository");
const invalid_ingredients_type_error_1 = require("./errors/invalid-ingredients-type-error");
const invalid_price_error_1 = require("./errors/invalid-price-error");
let CreateDishUseCase = class CreateDishUseCase {
    dishRepository;
    constructor(dishRepository) {
        this.dishRepository = dishRepository;
    }
    async execute({ name, price, description, categoryId, ingredients, attachmentsIds, }) {
        if (ingredients.length < 1) {
            return (0, either_1.left)(new invalid_ingredients_type_error_1.InvalidIngredientsTypeError());
        }
        if (price < 0) {
            return (0, either_1.left)(new invalid_price_error_1.InvalidPriceError());
        }
        const dish = dish_1.Dish.create({
            categoryId: new unique_entity_id_1.UniqueEntityID(categoryId),
            price: price_1.Price.create(price),
            description,
            name,
        });
        const ingredientsEntity = ingredients.map((ingredient) => {
            return ingredient_1.Ingredient.create({
                name: ingredient,
            });
        });
        const dishAttachments = attachmentsIds.map((attachmentId) => {
            return dish_attachment_1.DishAttachment.create({
                attachmentId: new unique_entity_id_1.UniqueEntityID(attachmentId),
                dishId: dish.id,
            });
        });
        const dishIngredient = ingredientsEntity.map((ingredient) => {
            return dish_ingredient_1.DishIngredient.create({
                ingredientName: ingredient.name,
                dishId: dish.id,
            });
        });
        dish.attachments = new dish_attachment_list_1.DishAttachmentList(dishAttachments);
        dish.ingredients = new dish_ingredient_list_1.DishIngredientList(dishIngredient);
        await this.dishRepository.create(dish);
        return (0, either_1.right)({
            dish,
        });
    }
};
exports.CreateDishUseCase = CreateDishUseCase;
exports.CreateDishUseCase = CreateDishUseCase = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [dish_repository_1.DishRepository])
], CreateDishUseCase);
//# sourceMappingURL=create-dish.js.map