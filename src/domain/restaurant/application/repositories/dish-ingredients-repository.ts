import { DishIngredient } from '../../enterprise/entities/dish-ingredient'

export interface DishIngredientsRepository {
  findManyByDishId(dishId: string): Promise<DishIngredient[]>
  deleteManyByDishId(dishId: string): Promise<void>
}
