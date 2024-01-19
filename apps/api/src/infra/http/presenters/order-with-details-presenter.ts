import { OrderWithDetails } from '@/domain/restaurant/enterprise/entities/value-objects/order-with-details'

export class OrderWithDetailsPresenter {
  static toHTTP(order: OrderWithDetails) {
    return {
      orderId: order.orderId.toString(),
      clientId: order.clientId.toString(),
      code: order.code,
      currency: order.currency,
      amountTotal: order.amountTotal,
      paymentMethod: order.paymentMethod,
      paymentStatus: order.paymentStatus,
      status: order.status,
      priority: order.priority,
      label: order.label,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
      cart: {
        totalAmount: order.cart.totalAmount,
        createdAt: order.cart.createdAt,
        updatedAt: order.cart.updatedAt,
        cartItems: order.cart.cartItems.map((cartItem) => ({
          id: cartItem.id.toString(),
          name: cartItem.name,
          description: cartItem.description,
          price: cartItem.price,
          slug: cartItem.slug,
          quantity: cartItem.quantity,
          ingredients: cartItem.ingredients,
          attachments: cartItem.attachments,
        })),
      },
    }
  }
}
