import { faker } from '@faker-js/faker'
import { Injectable } from '@nestjs/common'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  DishIngredient,
  DishIngredientProps,
} from '@/domain/restaurant/enterprise/entities/dish-ingredient'
import { PrismaService } from '@/infra/database/prisma/prisma.service'

export function makeDishIngredient(
  override: Partial<DishIngredientProps> = {},
  id?: UniqueEntityID,
) {
  const dishIngredient = DishIngredient.create(
    {
      dishId: new UniqueEntityID(),
      ingredientName: faker.commerce.productMaterial(),
      ...override,
    },
    id,
  )

  return dishIngredient
}

@Injectable()
export class DishIngredientFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaDishIngredient(
    data: Partial<DishIngredientProps> = {},
  ): Promise<DishIngredient> {
    const dishIngredient = makeDishIngredient(data)

    await this.prisma.ingredient.create({
      data: {
        dishId: dishIngredient.dishId.toString(),
        name: dishIngredient.ingredientName,
      },
    })

    return dishIngredient
  }
}
