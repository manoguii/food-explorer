import { Dish } from '@/domain/restaurant/enterprise/entities/dish'

export class DishPresenter {
  static toHTTP(dish: Dish) {
    return {
      id: dish.id.toString(),
      slug: dish.slug.value,
      name: dish.name,
      categoryId: dish.categoryId.toString(),
      description: dish.description,
      price: dish.price,
      createdAt: dish.createdAt,
      updatedAt: dish.updatedAt,
    }
  }
}
