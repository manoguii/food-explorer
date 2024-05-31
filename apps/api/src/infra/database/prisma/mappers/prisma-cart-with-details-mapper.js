"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaCartWithDetailsMapper = void 0;
const unique_entity_id_1 = require("../../../../core/entities/unique-entity-id");
const cart_with_details_1 = require("../../../../domain/restaurant/enterprise/entities/value-objects/cart-with-details");
class PrismaCartWithDetailsMapper {
    static toDomain(raw) {
        return cart_with_details_1.CartWithDetails.create({
            cartId: new unique_entity_id_1.UniqueEntityID(raw.id),
            totalAmount: raw.totalAmount,
            dishes: raw.cartItems.map((cartItem) => {
                return {
                    id: cartItem.dish.id,
                    name: cartItem.dish.name,
                    description: cartItem.dish.description,
                    price: cartItem.dish.price,
                    slug: cartItem.dish.slug,
                    attachments: cartItem.dish.attachments.map((attachment) => {
                        return {
                            id: attachment.id,
                            title: attachment.title,
                            url: attachment.url,
                        };
                    }),
                    quantity: cartItem.quantity,
                };
            }),
            client: {
                id: raw.user.id,
                name: raw.user.name,
                email: raw.user.email,
            },
            createdAt: raw.createdAt,
            updatedAt: raw.updatedAt,
        });
    }
}
exports.PrismaCartWithDetailsMapper = PrismaCartWithDetailsMapper;
//# sourceMappingURL=prisma-cart-with-details-mapper.js.map