"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaOrderMapper = void 0;
const unique_entity_id_1 = require("../../../../core/entities/unique-entity-id");
const order_1 = require("../../../../domain/restaurant/enterprise/entities/order");
class PrismaOrderMapper {
    static toDomain(raw) {
        return order_1.Order.create({
            cartId: new unique_entity_id_1.UniqueEntityID(raw.cartId),
            clientId: new unique_entity_id_1.UniqueEntityID(raw.userId),
            sessionId: new unique_entity_id_1.UniqueEntityID(raw.sessionId),
            code: raw.code,
            status: raw.status,
            label: raw.label,
            priority: raw.priority,
            amountTotal: raw.amountTotal,
            currency: raw.currency,
            paymentMethod: raw.paymentMethod,
            paymentStatus: raw.paymentStatus,
            createdAt: raw.createdAt,
            updatedAt: raw.updatedAt,
        }, new unique_entity_id_1.UniqueEntityID(raw.id));
    }
    static toPrisma(order) {
        return {
            id: order.id.toString(),
            userId: order.clientId.toString(),
            cartId: order.cartId.toString(),
            sessionId: order.sessionId.toString(),
            code: order.code,
            amountTotal: order.amountTotal,
            currency: order.currency,
            paymentMethod: order.paymentMethod,
            paymentStatus: order.paymentStatus,
            status: order.status,
            label: order.label,
            priority: order.priority,
            createdAt: order.createdAt,
            updatedAt: order.updatedAt,
        };
    }
}
exports.PrismaOrderMapper = PrismaOrderMapper;
//# sourceMappingURL=prisma-order-mapper.js.map