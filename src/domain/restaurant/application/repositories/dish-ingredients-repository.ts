import { DishIngredient } from '../../enterprise/entities/dish-ingredient'

export abstract class DishIngredientsRepository {
  abstract createMany(ingredients: DishIngredient[]): Promise<void>
  abstract deleteMany(ingredients: DishIngredient[]): Promise<void>

  abstract findManyByDishId(dishId: string): Promise<DishIngredient[]>
  abstract deleteManyByDishId(dishId: string): Promise<void>
}
