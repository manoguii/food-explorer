import { PaginationParams } from '@/core/repositories/pagination-params'
import { Category } from '@/domain/restaurant/enterprise/entities/category'

export abstract class CategoryRepository {
  abstract findById(id: string): Promise<Category | null>
  abstract findMany(params: PaginationParams): Promise<Category[]>
  abstract save(category: Category): Promise<void>
  abstract create(category: Category): Promise<void>
  abstract delete(category: Category): Promise<void>
}
