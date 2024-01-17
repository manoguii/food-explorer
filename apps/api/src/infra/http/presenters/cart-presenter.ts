import { Cart } from '@/domain/restaurant/enterprise/entities/cart'

export class CartPresenter {
  static toHTTP(cart: Cart) {
    return {
      cartId: cart.id.toString(),
      clientId: cart.clientId.toString(),
      totalAmount: cart.totalAmount,
      createdAt: cart.createdAt,
      updatedAt: cart.updatedAt,
    }
  }
}
