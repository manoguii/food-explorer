import { faker } from '@faker-js/faker'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  Order,
  OrderProps,
} from '@/domain/restaurant/enterprise/entities/order'
import { Code } from '@/domain/restaurant/enterprise/entities/value-objects/code'
import { makeDish } from './make-dish'

export function makeOrder(
  override: Partial<OrderProps> = {},
  id?: UniqueEntityID,
) {
  const order = Order.create(
    {
      code: Code.create(faker.random.alphaNumeric()),
      status: 'PENDING',
      items: [makeDish()],
      ...override,
    },
    id,
  )

  return order
}
