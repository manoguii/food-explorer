import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { PrismaDishIngredientMapper } from '../mappers/prisma-dish-ingredient-mapper'
import { DishIngredientsRepository } from '@/domain/restaurant/application/repositories/dish-ingredients-repository'
import { DishIngredient } from '@/domain/restaurant/enterprise/entities/dish-ingredient'

@Injectable()
export class PrismaDishIngredientsRepository
  implements DishIngredientsRepository
{
  constructor(private prisma: PrismaService) {}

  async findManyByDishId(dishId: string): Promise<DishIngredient[]> {
    const dishIngredient = await this.prisma.ingredient.findMany({
      where: {
        dishId,
      },
    })

    return dishIngredient.map(PrismaDishIngredientMapper.toDomain)
  }

  async deleteManyByDishId(dishId: string): Promise<void> {
    await this.prisma.ingredient.deleteMany({
      where: {
        dishId,
      },
    })
  }

  async createMany(ingredients: DishIngredient[]): Promise<void> {
    if (ingredients.length === 0) {
      return
    }

    const data = PrismaDishIngredientMapper.toPrismaCreateMany(ingredients)

    await this.prisma.ingredient.createMany(data)
  }

  async deleteMany(ingredients: DishIngredient[]): Promise<void> {
    if (ingredients.length === 0) {
      return
    }

    const ingredientIds = ingredients.map((ingredient) =>
      ingredient.id.toString(),
    )

    await this.prisma.ingredient.deleteMany({
      where: {
        id: {
          in: ingredientIds,
        },
      },
    })
  }
}
