import { Cart } from '@/domain/restaurant/enterprise/entities/cart'

export class CartPresenter {
  static toHTTP(cart: Cart) {
    return {
      id: cart.id.toString(),
      clientId: cart.clientId.toString(),
      checkoutUrl: cart.checkoutUrl,
      totalAmount: cart.totalAmount,
      createdAt: cart.createdAt,
      updatedAt: cart.updatedAt,
    }
  }
}
