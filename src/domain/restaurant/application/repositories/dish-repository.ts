import { PaginationParams } from '@/core/repositories/pagination-params'
import { Dish } from '@/domain/restaurant/enterprise/entities/dish'
import { DishWithDetails } from '../../enterprise/entities/value-objects/dish-with-details'

export abstract class DishRepository {
  abstract findById(id: string): Promise<Dish | null>
  abstract findBySlug(slug: string): Promise<Dish | null>
  abstract findBySlugWithDetails(slug: string): Promise<DishWithDetails | null>
  abstract findManyRecent(params: PaginationParams): Promise<Dish[]>
  abstract save(dish: Dish): Promise<void>
  abstract create(dish: Dish): Promise<void>
  abstract delete(dish: Dish): Promise<void>
}
