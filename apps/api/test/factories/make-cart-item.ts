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
  const cartItem = CartItem.create(
    {
      cartId: new UniqueEntityID(),
      dishId: new UniqueEntityID(),
      cost: Number(faker.commerce.price()),
      quantity: faker.number.int(),
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
      },
    })

    return cartItem
  }
}
