"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaDishIngredientMapper = void 0;
const unique_entity_id_1 = require("../../../../core/entities/unique-entity-id");
const dish_ingredient_1 = require("../../../../domain/restaurant/enterprise/entities/dish-ingredient");
class PrismaDishIngredientMapper {
    static toDomain(raw) {
        if (!raw.dishId) {
            throw new Error('DishId is required');
        }
        return dish_ingredient_1.DishIngredient.create({
            ingredientName: raw.name,
            dishId: new unique_entity_id_1.UniqueEntityID(raw.dishId),
        }, new unique_entity_id_1.UniqueEntityID(raw.id));
    }
    static toPrismaCreateMany(ingredientsParam) {
        const ingredients = ingredientsParam.map((ingredient) => {
            return {
                name: ingredient.ingredientName.toString(),
                dishId: ingredient.dishId.toString(),
            };
        });
        return {
            data: ingredients,
        };
    }
}
exports.PrismaDishIngredientMapper = PrismaDishIngredientMapper;
//# sourceMappingURL=prisma-dish-ingredient-mapper.js.map