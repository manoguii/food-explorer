import { faker } from '@faker-js/faker'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  Category,
  CategoryProps,
} from '@/domain/restaurant/enterprise/entities/category'

export function makeCategory(
  override: Partial<CategoryProps> = {},
  id?: UniqueEntityID,
) {
  const category = Category.create(
    {
      name: faker.commerce.department(),
      ...override,
    },
    id,
  )

  return category
}
