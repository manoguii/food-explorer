import { CartWithDetails } from '@/domain/restaurant/enterprise/entities/value-objects/cart-with-details'

export class CartWithDetailsPresenter {
  static toHTTP(cart: CartWithDetails) {
    return {
      cartId: cart.cartId.toString(),
      totalAmount: cart.totalAmount,
      createdAt: cart.createdAt,
      updatedAt: cart.updatedAt,
      dishes: cart.dishes.map((dish) => ({
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
      })),
      client: {
        id: cart.client.id.toString(),
        name: cart.client.name,
        email: cart.client.email,
      },
    }
  }
}
