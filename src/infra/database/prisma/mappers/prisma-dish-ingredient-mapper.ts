import { Prisma, Ingredient as PrismaDishIngredient } from '@prisma/client'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { DishIngredient } from '@/domain/restaurant/enterprise/entities/dish-ingredient'

export class PrismaDishIngredientMapper {
  static toDomain(raw: PrismaDishIngredient): DishIngredient {
    return DishIngredient.create(
      {
        ingredientId: new UniqueEntityID(raw.id),
        dishId: new UniqueEntityID(raw.dishId),
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPrismaUpdateMany(
    ingredients: DishIngredient[],
  ): Prisma.IngredientUpdateManyArgs {
    const ingredientIds = ingredients.map((ingredient) => {
      return ingredient.ingredientId.toString()
    })

    return {
      where: {
        id: {
          in: ingredientIds,
        },
      },
      data: {
        dishId: ingredients[0].dishId.toString(),
      },
    }
  }
}
