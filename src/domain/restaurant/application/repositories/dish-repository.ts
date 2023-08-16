import { PaginationParams } from '@/core/repositories/pagination-params'
import { Dish } from '../../enterprise/entities/dish'

export interface DishRepository {
  create(dish: Dish): Promise<void>
  save(dish: Dish): Promise<void>
  delete(dish: Dish): Promise<void>
  findManyByCategory(
    category: string,
    params: PaginationParams,
  ): Promise<Dish[] | null>
  findById(id: string): Promise<Dish | null>
  findBySlug(slug: string): Promise<Dish | null>
}
