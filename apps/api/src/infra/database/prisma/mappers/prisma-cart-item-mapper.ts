import { CartItem as PrismaCartItem, Prisma } from '@prisma/client'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { CartItem } from '@/domain/restaurant/enterprise/entities/cart-item'

export class PrismaCartItemMapper {
  static toDomain(raw: PrismaCartItem): CartItem {
    return CartItem.create(
      {
        dishId: new UniqueEntityID(raw.dishId),
        cartId: new UniqueEntityID(raw.cartId),
        cost: raw.cost,
        quantity: raw.quantity,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPrisma(cartItem: CartItem): Prisma.CartItemUncheckedCreateInput {
    return {
      id: cartItem.id.toString(),
      dishId: cartItem.dishId.toString(),
      cartId: cartItem.cartId.toString(),
      cost: cartItem.cost,
      quantity: cartItem.quantity,
      updatedAt: cartItem.updatedAt,
    }
  }
}
