import { Cart } from '@/domain/restaurant/enterprise/entities/cart'

import { CartWithDetails } from '../../enterprise/entities/value-objects/cart-with-details'

export abstract class CartRepository {
  abstract findById(id: string): Promise<Cart | null>

  abstract findByIdWithDetails(id: string): Promise<CartWithDetails | null>

  abstract findEmptyCartByClientId(clientId: string): Promise<Cart | null>

  abstract save(cart: Cart): Promise<void>
  abstract create(cart: Cart): Promise<void>
  abstract delete(cartId: Cart): Promise<void>
}
