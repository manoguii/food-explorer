import { Ingredient as PrismaIngredient } from '@prisma/client'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Ingredient } from '@/domain/restaurant/enterprise/entities/ingredient'

export class PrismaIngredientMapper {
  static toDomain(raw: PrismaIngredient): Ingredient {
    return Ingredient.create(
      {
        name: raw.title,
      },
      new UniqueEntityID(raw.id),
    )
  }
}
