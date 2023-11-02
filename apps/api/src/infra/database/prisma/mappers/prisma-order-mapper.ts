import { Order as PrismaOrder, Prisma } from '@prisma/client'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Order } from '@/domain/restaurant/enterprise/entities/order'
import { Code } from '@/domain/restaurant/enterprise/entities/value-objects/code'

export class PrismaOrderMapper {
  static toDomain(raw: PrismaOrder): Order {
    return Order.create(
      {
        clientId: new UniqueEntityID(raw.userId),
        code: Code.create(raw.code),
        status: raw.status,
        orderDetails: raw.orderDetails,
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
      orderDetails: order.orderDetails,
      code: order.code.value,
      status: order.status,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    }
  }
}
