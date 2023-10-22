import { DishWithDetails } from '@/domain/restaurant/enterprise/entities/value-objects/dish-with-details'

export class DishWithDetailsPresenter {
  static toHTTP(dish: DishWithDetails) {
    return {
      id: dish.dishId.toString(),
      name: dish.name,
      slug: dish.slug,
      description: dish.description,
      price: dish.price,
      category: dish.category,
      ingredients: dish.ingredients,
      createdAt: dish.createdAt,
      updatedAt: dish.updatedAt,
    }
  }
}
