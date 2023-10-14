import { PaginationParams } from '@/core/repositories/pagination-params'
import { Category } from '@/domain/restaurant/enterprise/entities/category'

export interface CategoryRepository {
  findById(id: string): Promise<Category | null>
  findMany(params: PaginationParams): Promise<Category[]>
  save(category: Category): Promise<void>
  create(category: Category): Promise<void>
  delete(category: Category): Promise<void>
}
