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
      attachments: dish.attachments.map((attachment) => ({
        title: attachment.title,
        url: `${attachment.url.startsWith('http') ? attachment.url : `${process.env.CLOUDFLARE_BASE_URL}/${attachment.url}`}`,
        id: attachment.id.toString(),
      })),
      isFavorite: dish.isFavorite,
      createdAt: dish.createdAt,
      updatedAt: dish.updatedAt,
    }
  }
}
