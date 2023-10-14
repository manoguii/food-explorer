import { Dish } from '@/domain/restaurant/enterprise/entities/dish'

export class DishPresenter {
  static toHTTP(dish: Dish) {
    return {
      id: dish.id.toString(),
      slug: dish.slug.value,
      name: dish.name,
      createdAt: dish.createdAt,
      updatedAt: dish.updatedAt,
    }
  }
}
