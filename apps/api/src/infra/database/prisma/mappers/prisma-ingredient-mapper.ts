import { Ingredient as PrismaIngredient, Prisma } from '@prisma/client'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Ingredient } from '@/domain/restaurant/enterprise/entities/ingredient'

export class PrismaIngredientMapper {
  static toPrisma(
    ingredient: Ingredient,
  ): Prisma.IngredientUncheckedCreateInput {
    return {
      id: ingredient.id.toString(),
      name: ingredient.name,
    }
  }

  static toDomain(raw: PrismaIngredient): Ingredient {
    return Ingredient.create(
      {
        name: raw.name,
      },
      new UniqueEntityID(raw.id),
    )
  }
}
