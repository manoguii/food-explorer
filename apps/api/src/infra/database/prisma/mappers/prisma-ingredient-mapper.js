"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaIngredientMapper = void 0;
const unique_entity_id_1 = require("../../../../core/entities/unique-entity-id");
const ingredient_1 = require("../../../../domain/restaurant/enterprise/entities/ingredient");
class PrismaIngredientMapper {
    static toPrisma(ingredient) {
        return {
            id: ingredient.id.toString(),
            name: ingredient.name,
        };
    }
    static toDomain(raw) {
        return ingredient_1.Ingredient.create({
            name: raw.name,
        }, new unique_entity_id_1.UniqueEntityID(raw.id));
    }
}
exports.PrismaIngredientMapper = PrismaIngredientMapper;
//# sourceMappingURL=prisma-ingredient-mapper.js.map