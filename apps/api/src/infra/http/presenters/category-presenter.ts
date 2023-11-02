import { Category } from '@/domain/restaurant/enterprise/entities/category'

export class CategoryPresenter {
  static toHTTP(category: Category) {
    return {
      id: category.id.toString(),
      name: category.name,
      createdAt: category.createdAt,
    }
  }
}
