import { UniqueEntityID } from '@/core/entities/unique-entity-id'

import {
  DishIngredient,
  DishIngredientProps,
} from '@/domain/restaurant/enterprise/entities/dish-ingredient'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { Injectable } from '@nestjs/common'

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

@Injectable()
export class DishIngredientFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaDishIngredient(
    data: Partial<DishIngredientProps> = {},
  ): Promise<DishIngredient> {
    const dishIngredient = makeDishIngredient(data)

    await this.prisma.ingredient.update({
      where: {
        id: dishIngredient.ingredientId.toString(),
      },
      data: {
        dishId: dishIngredient.dishId.toString(),
      },
    })

    return dishIngredient
  }
}
