import { DishWithAttachments } from '@/domain/restaurant/enterprise/entities/value-objects/dish-with-attachments'

export class DishWithAttachmentsPresenter {
  static toHTTP(dish: DishWithAttachments) {
    return {
      id: dish.dishId.toString(),
      name: dish.name,
      slug: dish.slug,
      description: dish.description,
      price: dish.price,
      attachments: dish.attachments.map((attachment) => ({
        title: attachment.title,
        url: attachment.url,
      })),
      createdAt: dish.createdAt,
      updatedAt: dish.updatedAt,
    }
  }
}
