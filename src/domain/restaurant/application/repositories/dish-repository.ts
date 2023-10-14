import { Dish } from '@/domain/restaurant/enterprise/entities/dish'

export interface DishRepository {
  findById(id: string): Promise<Dish | null>
  findBySlug(slug: string): Promise<Dish | null>
  save(dish: Dish): Promise<void>
  create(dish: Dish): Promise<void>
  delete(dish: Dish): Promise<void>
}
