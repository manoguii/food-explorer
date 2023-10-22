import { UniqueEntityID } from '@/core/entities/unique-entity-id'

import {
  OrderItem,
  OrderItemProps,
} from '@/domain/restaurant/enterprise/entities/order-item'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { faker } from '@faker-js/faker'
import { Injectable } from '@nestjs/common'

export function makeOrderItem(
  override: Partial<OrderItemProps> = {},
  id?: UniqueEntityID,
) {
  const orderItem = OrderItem.create(
    {
      orderId: new UniqueEntityID(),
      dishId: new UniqueEntityID(),
      quantity: Number(faker.string.numeric()),
      ...override,
    },
    id,
  )

  return orderItem
}

@Injectable()
export class OrderItemFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaOrderItem(
    data: Partial<OrderItemProps> = {},
  ): Promise<OrderItem> {
    const orderItem = makeOrderItem(data)

    await this.prisma.orderItem.create({
      data: {
        dishId: orderItem.dishId.toString(),
        orderId: orderItem.orderId.toString(),
        quantity: orderItem.quantity,
        status: orderItem.status,
      },
    })

    return orderItem
  }
}
