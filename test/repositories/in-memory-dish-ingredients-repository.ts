import { DishIngredientsRepository } from '@/domain/restaurant/application/repositories/dish-ingredients-repository'
import { DishIngredient } from '@/domain/restaurant/enterprise/entities/dish-ingredient'

export class InMemoryDishIngredientsRepository
  implements DishIngredientsRepository
{
  public items: DishIngredient[] = []

  async createMany(ingredients: DishIngredient[]): Promise<void> {
    this.items.push(...ingredients)
  }

  async deleteMany(ingredients: DishIngredient[]): Promise<void> {
    const dishIngredients = this.items.filter((item) => {
      return !ingredients.some((ingredient) => ingredient.equals(item))
    })

    this.items = dishIngredients
  }

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
