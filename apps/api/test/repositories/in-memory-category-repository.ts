import { PaginationParams } from '@/core/repositories/pagination-params'
import { CategoryRepository } from '@/domain/restaurant/application/repositories/category-repository'
import { Category } from '@/domain/restaurant/enterprise/entities/category'

export class InMemoryCategoryRepository implements CategoryRepository {
  public items: Category[] = []

  async findById(id: string) {
    const category = this.items.find((item) => item.id.toString() === id)

    if (!category) {
      return null
    }

    return category
  }

  async findByName(name: string) {
    const category = this.items.find((item) => item.name === name)

    if (!category) {
      return null
    }

    return category
  }

  async findMany({ page }: PaginationParams): Promise<{
    categories: Category[]
    totalPages: number
  }> {
    const perPage = 10

    const totalCategories = this.items.length

    const categories = this.items
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice((page - 1) * perPage, page * perPage)

    const totalPages = Math.ceil(totalCategories / perPage)

    return {
      categories,
      totalPages,
    }
  }

  async create(category: Category) {
    this.items.push(category)
  }

  async save(category: Category) {
    const itemIndex = this.items.findIndex((item) => item.id === category.id)

    this.items[itemIndex] = category
  }

  async delete(category: Category) {
    const itemIndex = this.items.findIndex((item) => item.id === category.id)

    this.items.splice(itemIndex, 1)
  }
}
