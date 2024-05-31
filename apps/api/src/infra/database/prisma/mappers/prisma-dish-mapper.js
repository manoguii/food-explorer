"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaDishMapper = void 0;
const unique_entity_id_1 = require("../../../../core/entities/unique-entity-id");
const dish_1 = require("../../../../domain/restaurant/enterprise/entities/dish");
const price_1 = require("../../../../domain/restaurant/enterprise/entities/value-objects/price");
const slug_1 = require("../../../../domain/restaurant/enterprise/entities/value-objects/slug");
class PrismaDishMapper {
    static toDomain(raw) {
        return dish_1.Dish.create({
            categoryId: new unique_entity_id_1.UniqueEntityID(raw.categoryId),
            price: price_1.Price.create(raw.price),
            slug: slug_1.Slug.create(raw.slug),
            name: raw.name,
            description: raw.description,
            createdAt: raw.createdAt,
            updatedAt: raw.updatedAt,
        }, new unique_entity_id_1.UniqueEntityID(raw.id));
    }
    static toPrisma(dish) {
        return {
            id: dish.id.toString(),
            categoryId: dish.categoryId.toString(),
            name: dish.name,
            description: dish.description,
            price: dish.price,
            slug: dish.slug.value,
            createdAt: dish.createdAt,
            updatedAt: dish.updatedAt,
        };
    }
}
exports.PrismaDishMapper = PrismaDishMapper;
//# sourceMappingURL=prisma-dish-mapper.js.map