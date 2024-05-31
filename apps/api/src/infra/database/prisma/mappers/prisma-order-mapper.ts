import { Order as PrismaOrder, Prisma } from '@prisma/client'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Order } from '@/domain/restaurant/enterprise/entities/order'

export class PrismaOrderMapper {
  static toDomain(raw: PrismaOrder): Order {
    return Order.create(
      {
        cartId: new UniqueEntityID(raw.cartId),
        clientId: new UniqueEntityID(raw.userId),
        sessionId: new UniqueEntityID(raw.sessionId),
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
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPrisma(order: Order): Prisma.OrderUncheckedCreateInput {
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
    }
  }
}
