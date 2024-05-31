import { faker } from '@faker-js/faker'
import { Injectable } from '@nestjs/common'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  Ingredient,
  IngredientProps,
} from '@/domain/restaurant/enterprise/entities/ingredient'
import { PrismaIngredientMapper } from '@/infra/database/prisma/mappers/prisma-ingredient-mapper'
import { PrismaService } from '@/infra/database/prisma/prisma.service'

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

@Injectable()
export class IngredientFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaIngredient(
    data: Partial<IngredientProps> = {},
  ): Promise<Ingredient> {
    const ingredient = makeIngredient(data)

    await this.prisma.ingredient.create({
      data: PrismaIngredientMapper.toPrisma(ingredient),
    })

    return ingredient
  }
}
