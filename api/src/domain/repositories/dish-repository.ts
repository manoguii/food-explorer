import { Dish } from '../entities/dish'

export interface DishRepository {
  create(dish: Dish): Promise<void>
}
