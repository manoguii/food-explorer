import { DishIngredientsRepository } from '@/domain/restaurant/application/repositories/dish-ingredients-repository'
import { DishIngredient } from '@/domain/restaurant/enterprise/entities/dish-ingredient'

export class InMemoryDishIngredientsRepository
  implements DishIngredientsRepository
{
  public items: DishIngredient[] = []

  async findManyByDishId(dishId: string) {
    const dishIngredients = this.items.filter(
      (item) => item.dishId.toString() === dishId,
    )

    return dishIngredients
  }

  async deleteManyByDishId(dishId: string) {
    const dishIngredients = this.items.filter(
      (item) => item.dishId.toString() !== dishId,
    )

    this.items = dishIngredients
  }
}
