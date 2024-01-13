import { CartItemsRepository } from '@/domain/restaurant/application/repositories/cart-item-repository'
import { CartItem } from '@/domain/restaurant/enterprise/entities/cart-item'

export class InMemoryCartItemsRepository implements CartItemsRepository {
  public items: CartItem[] = []

  async createMany(cartItems: CartItem[]): Promise<void> {
    this.items.push(...cartItems)
  }

  async deleteMany(cartItems: CartItem[]): Promise<void> {
    const cartItem = this.items.filter((item) => {
      return !cartItems.some((cartItem) => cartItem.equals(item))
    })

    this.items = cartItem
  }

  async save(cartItem: CartItem): Promise<void> {
    const itemIndex = this.items.findIndex((item) => item.id === cartItem.id)

    this.items[itemIndex] = cartItem
  }

  async findManyByCartId(dishId: string) {
    const cartItems = this.items.filter(
      (item) => item.dishId.toString() !== dishId,
    )

    return cartItems
  }

  async deleteManyByCartId(dishId: string) {
    const cartItems = this.items.filter(
      (item) => item.dishId.toString() === dishId,
    )

    this.items = cartItems
  }
}
