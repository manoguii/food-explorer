import { DishIngredient } from '../../enterprise/entities/dish-ingredient'

export abstract class DishIngredientsRepository {
  abstract findManyByDishId(dishId: string): Promise<DishIngredient[]>
  abstract deleteManyByDishId(dishId: string): Promise<void>
}
