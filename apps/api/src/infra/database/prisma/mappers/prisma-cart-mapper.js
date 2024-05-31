"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaCartMapper = void 0;
const unique_entity_id_1 = require("../../../../core/entities/unique-entity-id");
const cart_1 = require("../../../../domain/restaurant/enterprise/entities/cart");
class PrismaCartMapper {
    static toDomain(raw) {
        return cart_1.Cart.create({
            clientId: new unique_entity_id_1.UniqueEntityID(raw.userId),
            totalAmount: raw.totalAmount,
            createdAt: raw.createdAt,
            updatedAt: raw.updatedAt,
        }, new unique_entity_id_1.UniqueEntityID(raw.id));
    }
    static toPrisma(cart) {
        return {
            id: cart.id.toString(),
            userId: cart.clientId.toString(),
            totalAmount: cart.totalAmount,
            createdAt: cart.createdAt,
            updatedAt: cart.updatedAt,
        };
    }
}
exports.PrismaCartMapper = PrismaCartMapper;
//# sourceMappingURL=prisma-cart-mapper.js.map