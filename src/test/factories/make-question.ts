import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Dish, DishProps } from '@/domain/restaurant/enterprise/entities/dish'
import { Price } from '@/domain/restaurant/enterprise/entities/value-objects/price'
import { faker } from '@faker-js/faker'

export function makeDish(
  override: Partial<DishProps> = {},
  id?: UniqueEntityId,
) {
  const dish = Dish.create(
    {
      name: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
      ingredients: [
        faker.commerce.productAdjective(),
        faker.commerce.productAdjective(),
      ],
      category: faker.commerce.productMaterial(),
      price: Price.fromCents(Number(faker.commerce.price())),
      ...override,
    },
    id,
  )

  return dish
}
