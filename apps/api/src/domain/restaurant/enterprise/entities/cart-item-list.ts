import { WatchedList } from '@/core/entities/watched-list'
import { CartItem } from './cart-item'

export class CartItemList extends WatchedList<CartItem> {
  compareItems(a: CartItem, b: CartItem): boolean {
    return a.id.toString() === b.id.toString() && a.quantity === b.quantity
  }
}
