"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaCartItemMapper = void 0;
const unique_entity_id_1 = require("../../../../core/entities/unique-entity-id");
const cart_item_1 = require("../../../../domain/restaurant/enterprise/entities/cart-item");
class PrismaCartItemMapper {
    static toDomain(raw) {
        return cart_item_1.CartItem.create({
            dishId: new unique_entity_id_1.UniqueEntityID(raw.dishId),
            cartId: new unique_entity_id_1.UniqueEntityID(raw.cartId),
            cost: raw.cost,
            quantity: raw.quantity,
            updatedAt: raw.updatedAt,
        }, new unique_entity_id_1.UniqueEntityID(raw.id));
    }
    static toPrisma(cartItem) {
        return {
            id: cartItem.id.toString(),
            dishId: cartItem.dishId.toString(),
            cartId: cartItem.cartId.toString(),
            cost: cartItem.cost,
            quantity: cartItem.quantity,
            updatedAt: cartItem.updatedAt,
        };
    }
}
exports.PrismaCartItemMapper = PrismaCartItemMapper;
//# sourceMappingURL=prisma-cart-item-mapper.js.map