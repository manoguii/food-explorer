import { faker } from '@faker-js/faker'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  Ingredient,
  IngredientProps,
} from '@/domain/restaurant/enterprise/entities/ingredient'

export function makeIngredient(
  override: Partial<IngredientProps> = {},
  id?: UniqueEntityID,
) {
  const ingredient = Ingredient.create(
    {
      name: faker.commerce.productMaterial(),
      ...override,
    },
    id,
  )

  return ingredient
}
