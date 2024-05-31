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
exports.EditDishUseCase = void 0;
const common_1 = require("@nestjs/common");
const either_1 = require("../../../../core/either");
const unique_entity_id_1 = require("../../../../core/entities/unique-entity-id");
const resource_not_found_error_1 = require("../../../../core/errors/errors/resource-not-found-error");
const dish_attachment_1 = require("../../enterprise/entities/dish-attachment");
const dish_attachment_list_1 = require("../../enterprise/entities/dish-attachment-list");
const dish_ingredient_1 = require("../../enterprise/entities/dish-ingredient");
const dish_ingredient_list_1 = require("../../enterprise/entities/dish-ingredient-list");
const category_repository_1 = require("../repositories/category-repository");
const dish_attachments_repository_1 = require("../repositories/dish-attachments-repository");
const dish_ingredients_repository_1 = require("../repositories/dish-ingredients-repository");
const dish_repository_1 = require("../repositories/dish-repository");
let EditDishUseCase = class EditDishUseCase {
    dishRepository;
    dishAttachmentsRepository;
    dishIngredientsRepository;
    categoryRepository;
    constructor(dishRepository, dishAttachmentsRepository, dishIngredientsRepository, categoryRepository) {
        this.dishRepository = dishRepository;
        this.dishAttachmentsRepository = dishAttachmentsRepository;
        this.dishIngredientsRepository = dishIngredientsRepository;
        this.categoryRepository = categoryRepository;
    }
    async execute({ dishId, description, name, price, categoryId, attachmentsIds, ingredients, }) {
        const dish = await this.dishRepository.findById(dishId);
        if (!dish) {
            return (0, either_1.left)(new resource_not_found_error_1.ResourceNotFoundError());
        }
        const currentDishAttachments = await this.dishAttachmentsRepository.findManyByDishId(dishId);
        const currentDishIngredients = await this.dishIngredientsRepository.findManyByDishId(dishId);
        const dishAttachmentsList = new dish_attachment_list_1.DishAttachmentList(currentDishAttachments);
        const dishIngredientsList = new dish_ingredient_list_1.DishIngredientList(currentDishIngredients);
        const dishAttachments = attachmentsIds.map((attachmentId) => {
            return dish_attachment_1.DishAttachment.create({
                attachmentId: new unique_entity_id_1.UniqueEntityID(attachmentId),
                dishId: dish.id,
            });
        });
        const dishIngredient = ingredients.map((ingredient) => {
            return dish_ingredient_1.DishIngredient.create({
                ingredientName: ingredient,
                dishId: dish.id,
            });
        });
        const category = await this.categoryRepository.findById(categoryId);
        if (!category) {
            return (0, either_1.left)(new resource_not_found_error_1.ResourceNotFoundError());
        }
        dishAttachmentsList.update(dishAttachments);
        dishIngredientsList.update(dishIngredient);
        dish.name = name;
        dish.price = price;
        dish.description = description;
        dish.categoryId = category.id;
        dish.attachments = dishAttachmentsList;
        dish.ingredients = dishIngredientsList;
        await this.dishRepository.save(dish);
        return (0, either_1.right)({
            dish,
        });
    }
};
exports.EditDishUseCase = EditDishUseCase;
exports.EditDishUseCase = EditDishUseCase = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [dish_repository_1.DishRepository,
        dish_attachments_repository_1.DishAttachmentsRepository,
        dish_ingredients_repository_1.DishIngredientsRepository,
        category_repository_1.CategoryRepository])
], EditDishUseCase);
//# sourceMappingURL=edit-dish.js.map