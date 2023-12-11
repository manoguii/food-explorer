import { OrderWithDetails } from '@/domain/restaurant/enterprise/entities/value-objects/order-with-details'

export class OrderWithDetailsPresenter {
  static toHTTP(order: OrderWithDetails) {
    return {
      id: order.orderId.toString(),
      status: order.status,
      code: order.code,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
      dishes: order.dishes.map((dish) => ({
        id: dish.id.toString(),
        name: dish.name,
        description: dish.description,
        price: dish.price,
        slug: dish.slug,
        attachments: dish.attachments.map((attachment) => ({
          id: attachment.id.toString(),
          title: attachment.title,
          url: attachment.url,
        })),
        quantity: dish.quantity,
        status: dish.status,
      })),
    }
  }
}
