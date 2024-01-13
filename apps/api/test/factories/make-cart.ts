import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Cart, CartProps } from '@/domain/restaurant/enterprise/entities/cart'
import { PrismaCartMapper } from '@/infra/database/prisma/mappers/prisma-cart-mapper'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { faker } from '@faker-js/faker'
import { Injectable } from '@nestjs/common'

export function makeCart(
  override: Partial<CartProps> = {},
  id?: UniqueEntityID,
) {
  const cart = Cart.create(
    {
      clientId: new UniqueEntityID(),
      totalAmount: Number(faker.commerce.price()),
      ...override,
    },
    id,
  )

  return cart
}

@Injectable()
export class CartFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaCart(data: Partial<CartProps> = {}): Promise<Cart> {
    const cart = makeCart(data)

    await this.prisma.cart.create({
      data: PrismaCartMapper.toPrisma(cart),
    })

    return cart
  }
}
