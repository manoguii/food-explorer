"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaDishWithAttachmentsMapper = void 0;
const unique_entity_id_1 = require("../../../../core/entities/unique-entity-id");
const attachment_1 = require("../../../../domain/restaurant/enterprise/entities/attachment");
const dish_with_attachments_1 = require("../../../../domain/restaurant/enterprise/entities/value-objects/dish-with-attachments");
class PrismaDishWithAttachmentsMapper {
    static toDomain(raw) {
        return dish_with_attachments_1.DishWithAttachments.create({
            dishId: new unique_entity_id_1.UniqueEntityID(raw.id),
            name: raw.name,
            description: raw.description,
            price: raw.price,
            slug: raw.slug,
            attachments: raw.attachments.map((attachment) => attachment_1.Attachment.create({
                title: attachment.title,
                url: attachment.url,
            })),
            createdAt: raw.createdAt,
            updatedAt: raw.updatedAt,
        });
    }
}
exports.PrismaDishWithAttachmentsMapper = PrismaDishWithAttachmentsMapper;
//# sourceMappingURL=prisma-dish-with-attachments-mapper.js.map