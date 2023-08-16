import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import {
  Order,
  OrderProps,
} from '@/domain/restaurant/enterprise/entities/order'
import { Price } from '@/domain/restaurant/enterprise/entities/value-objects/price'
import { faker } from '@faker-js/faker'

export function makeOrder(
  override: Partial<OrderProps> = {},
  id?: UniqueEntityId,
) {
  const order = Order.create(
    {
      userId: new UniqueEntityId().toString(),
      dishes: [],
      paymentMethod: 'credit',
      total: Price.fromCents(Number(faker.commerce.price())),
      ...override,
    },
    id,
  )

  return order
}
