import { CartItem } from '../../enterprise/entities/cart-item'

export abstract class CartItemsRepository {
  abstract createMany(cartItems: CartItem[]): Promise<void>
  abstract deleteMany(cartItems: CartItem[]): Promise<void>
  abstract save(cartItem: CartItem): Promise<void>
  abstract findManyByCartId(cartId: string): Promise<CartItem[]>
  abstract deleteManyByCartId(cartId: string): Promise<void>
}
