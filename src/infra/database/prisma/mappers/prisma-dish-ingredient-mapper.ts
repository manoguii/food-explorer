import { Prisma, Ingredient as PrismaDishIngredient } from '@prisma/client'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { DishIngredient } from '@/domain/restaurant/enterprise/entities/dish-ingredient'

export class PrismaDishIngredientMapper {
  static toDomain(raw: PrismaDishIngredient): DishIngredient {
    if (!raw.dishId) {
      throw new Error('DishId is required')
    }

    return DishIngredient.create(
      {
        ingredientName: raw.name,
        dishId: new UniqueEntityID(raw.dishId),
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPrismaUpdateMany(
    ingredientsParam: DishIngredient[],
  ): Prisma.IngredientCreateManyArgs {
    const ingredients = ingredientsParam.map((ingredient) => {
      return {
        name: ingredient.ingredientName.toString(),
        dishId: ingredient.dishId.toString(),
      }
    })

    return {
      data: ingredients,
    }
  }
}
