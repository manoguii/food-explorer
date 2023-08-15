import { DishRepository } from '@/domain/restaurant/application/repositories/dish-repository'
import { Dish } from '@/domain/restaurant/enterprise/entities/dish'

export class InMemoryDishRepository implements DishRepository {
  public items: Dish[] = []

  async create(dish: Dish): Promise<void> {
    this.items.push(dish)
  }
}
