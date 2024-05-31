"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaDishWithDetailsMapper = void 0;
const unique_entity_id_1 = require("../../../../core/entities/unique-entity-id");
const dish_with_details_1 = require("../../../../domain/restaurant/enterprise/entities/value-objects/dish-with-details");
class PrismaDishWithDetailsMapper {
    static toDomain(raw) {
        return dish_with_details_1.DishWithDetails.create({
            dishId: new unique_entity_id_1.UniqueEntityID(raw.id),
            name: raw.name,
            description: raw.description,
            price: raw.price,
            slug: raw.slug,
            category: raw.category.name,
            ingredients: raw.ingredients.map((ingredient) => ingredient.name),
            attachments: raw.attachments.map((attachment) => {
                return {
                    title: attachment.title,
                    url: attachment.url,
                    id: attachment.id,
                };
            }),
            createdAt: raw.createdAt,
            updatedAt: raw.updatedAt,
        });
    }
}
exports.PrismaDishWithDetailsMapper = PrismaDishWithDetailsMapper;
//# sourceMappingURL=prisma-dish-with-details-mapper.js.map