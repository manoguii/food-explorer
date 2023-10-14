import { UniqueEntityID } from '@/core/entities/unique-entity-id'

import {
  OrderItem,
  OrderItemProps,
} from '@/domain/restaurant/enterprise/entities/order-item'
import { faker } from '@faker-js/faker'

export function makeOrderItem(
  override: Partial<OrderItemProps> = {},
  id?: UniqueEntityID,
) {
  const orderItem = OrderItem.create(
    {
      orderId: new UniqueEntityID(),
      dishId: new UniqueEntityID(),
      quantity: faker.random.numeric(1),
      ...override,
    },
    id,
  )

  return orderItem
}
