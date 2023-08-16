import { Dish } from '../../enterprise/entities/dish'

export interface DishRepository {
  create(dish: Dish): Promise<void>
  findById(id: string): Promise<Dish | null>
  findBySlug(slug: string): Promise<Dish | null>
  delete(dish: Dish): Promise<void>
}
