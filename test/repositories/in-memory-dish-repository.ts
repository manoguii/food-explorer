import { DishRepository } from '@/domain/restaurant/application/repositories/dish-repository'
import { Dish } from '@/domain/restaurant/enterprise/entities/dish'

export class InMemoryDishRepository implements DishRepository {
  public items: Dish[] = []

  async findById(id: string) {
    const dish = this.items.find((item) => item.id.toString() === id)

    if (!dish) {
      return null
    }

    return dish
  }

  async findBySlug(slug: string) {
    const dish = this.items.find((item) => item.slug.value === slug)

    if (!dish) {
      return null
    }

    return dish
  }

  async create(dish: Dish) {
    this.items.push(dish)
  }

  async save(dish: Dish) {
    const itemIndex = this.items.findIndex((item) => item.id === dish.id)

    this.items[itemIndex] = dish
  }

  async delete(dish: Dish) {
    const itemIndex = this.items.findIndex((item) => item.id === dish.id)

    this.items.splice(itemIndex, 1)
  }
}
