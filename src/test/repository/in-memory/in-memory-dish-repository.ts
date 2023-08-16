import { PaginationParams } from '@/core/repositories/pagination-params'
import { DishRepository } from '@/domain/restaurant/application/repositories/dish-repository'
import { Dish } from '@/domain/restaurant/enterprise/entities/dish'

export class InMemoryDishRepository implements DishRepository {
  public items: Dish[] = []

  async create(dish: Dish): Promise<void> {
    this.items.push(dish)
  }

  async save(dish: Dish): Promise<void> {
    const itemIndex = this.items.findIndex((item) => item.id === dish.id)

    this.items[itemIndex] = dish
  }

  async delete(dish: Dish): Promise<void> {
    const itemIndex = this.items.findIndex((item) => item.id === dish.id)

    this.items.splice(itemIndex, 1)
  }

  async findManyByCategory(
    category: string,
    { page = 1 }: PaginationParams,
  ): Promise<Dish[] | null> {
    const dish = await this.items
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice((page - 1) * 20, page * 20)
      .filter((item) => item.category === category)

    return dish
  }

  async findBySlug(slug: string): Promise<Dish | null> {
    const dish = this.items.find((item) => item.slug.value === slug)

    if (!dish) {
      return null
    }

    return dish
  }

  async findById(id: string): Promise<Dish | null> {
    const dish = this.items.find((item) => item.id.toString() === id)

    if (!dish) {
      return null
    }

    return dish
  }
}
