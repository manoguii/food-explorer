import { UniqueEntityID } from '@/core/entities/unique-entity-id'

import {
  CartItem,
  CartItemProps,
} from '@/domain/restaurant/enterprise/entities/cart-item'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { faker } from '@faker-js/faker'
import { Injectable } from '@nestjs/common'

export function makeCartItem(
  override: Partial<CartItemProps> = {},
  id?: UniqueEntityID,
) {
  const dishPrice = override.dishPrice
    ? override.dishPrice
    : Number(faker.string.numeric())
  const quantity = override.quantity
    ? override.quantity
    : Number(faker.string.numeric())
  const cost = override.cost ? override.cost : dishPrice * quantity

  const cartItem = CartItem.create(
    {
      cartId: new UniqueEntityID(),
      dishId: new UniqueEntityID(),
      cost,
      dishPrice,
      quantity,
      ...override,
    },
    id,
  )

  return cartItem
}

@Injectable()
export class CartItemFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaCartItem(
    data: Partial<CartItemProps> = {},
  ): Promise<CartItem> {
    const cartItem = makeCartItem(data)

    await this.prisma.cartItem.create({
      data: {
        dishId: cartItem.dishId.toString(),
        cartId: cartItem.cartId.toString(),
        quantity: cartItem.quantity,
        cost: cartItem.cost,
        dishPrice: cartItem.dishPrice,
      },
    })

    return cartItem
  }
}
