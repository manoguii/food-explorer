"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaDishAttachmentMapper = void 0;
const unique_entity_id_1 = require("../../../../core/entities/unique-entity-id");
const dish_attachment_1 = require("../../../../domain/restaurant/enterprise/entities/dish-attachment");
class PrismaDishAttachmentMapper {
    static toDomain(raw) {
        if (!raw.dishId) {
            throw new Error('DishId is required');
        }
        return dish_attachment_1.DishAttachment.create({
            attachmentId: new unique_entity_id_1.UniqueEntityID(raw.id),
            dishId: new unique_entity_id_1.UniqueEntityID(raw.dishId),
        }, new unique_entity_id_1.UniqueEntityID(raw.id));
    }
    static toPrismaUpdateMany(attachments) {
        const attachmentIds = attachments.map((attachment) => {
            return attachment.attachmentId.toString();
        });
        return {
            where: {
                id: {
                    in: attachmentIds,
                },
            },
            data: {
                dishId: attachments[0].dishId.toString(),
            },
        };
    }
}
exports.PrismaDishAttachmentMapper = PrismaDishAttachmentMapper;
//# sourceMappingURL=prisma-dish-attachment-mapper.js.map