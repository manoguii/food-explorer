"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaCategoryMapper = void 0;
const unique_entity_id_1 = require("../../../../core/entities/unique-entity-id");
const category_1 = require("../../../../domain/restaurant/enterprise/entities/category");
class PrismaCategoryMapper {
    static toDomain(raw) {
        return category_1.Category.create({
            name: raw.name,
        }, new unique_entity_id_1.UniqueEntityID(raw.id));
    }
    static toPrisma(category) {
        return {
            id: category.id.toString(),
            name: category.name,
        };
    }
}
exports.PrismaCategoryMapper = PrismaCategoryMapper;
//# sourceMappingURL=prisma-category-mapper.js.map