import { UniqueEntityID } from '@/core/entities/unique-entity-id'

import {
  DishIngredient,
  DishIngredientProps,
} from '@/domain/restaurant/enterprise/entities/dish-ingredient'

export function makeDishIngredient(
  override: Partial<DishIngredientProps> = {},
  id?: UniqueEntityID,
) {
  const dishIngredient = DishIngredient.create(
    {
      dishId: new UniqueEntityID(),
      ingredientId: new UniqueEntityID(),
      ...override,
    },
    id,
  )

  return dishIngredient
}
