import { OrderItem as PrismaOrderItem, Prisma } from '@prisma/client'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { OrderItem } from '@/domain/restaurant/enterprise/entities/order-item'

export class PrismaOrderItemMapper {
  static toDomain(raw: PrismaOrderItem): OrderItem {
    return OrderItem.create(
      {
        dishId: new UniqueEntityID(raw.dishId),
        orderId: new UniqueEntityID(raw.orderId),
        status: raw.status,
        quantity: raw.quantity,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPrismaUpdateMany(orders: OrderItem[]): Prisma.OrderUpdateManyArgs {
    const orderIds = orders.map((order) => {
      return order.orderId.toString()
    })

    return {
      where: {
        id: {
          in: orderIds,
        },
      },
      data: {},
    }
  }
}
