import { faker } from '@faker-js/faker'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Dish, DishProps } from '@/domain/restaurant/enterprise/entities/dish'
import { Price } from '@/domain/restaurant/enterprise/entities/value-objects/price'

export function makeDish(
  override: Partial<DishProps> = {},
  id?: UniqueEntityID,
) {
  const dish = Dish.create(
    {
      name: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
      price: Price.create(faker.commerce.price()),
      categoryId: new UniqueEntityID(),
      ...override,
    },
    id,
  )

  return dish
}
