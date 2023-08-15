import { Dish } from '../../enterprise/entities/dish'

export interface DishRepository {
  create(dish: Dish): Promise<void>
}
