import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { PrismaCartItemMapper } from '../mappers/prisma-cart-item-mapper'
import { CartItemsRepository } from '@/domain/restaurant/application/repositories/cart-item-repository'
import { CartItem } from '@/domain/restaurant/enterprise/entities/cart-item'

@Injectable()
export class PrismaCartItemsRepository implements CartItemsRepository {
  constructor(private prisma: PrismaService) {}

  async save(cartItem: CartItem): Promise<void> {
    const data = PrismaCartItemMapper.toPrisma(cartItem)

    await this.prisma.cartItem.update({
      where: {
        id: data.id,
      },
      data,
    })
  }

  async createMany(cartItems: CartItem[]): Promise<void> {
    if (cartItems.length === 0) {
      return
    }

    await this.prisma.cartItem.createMany({
      data: cartItems.map((cartItem) =>
        PrismaCartItemMapper.toPrisma(cartItem),
      ),
    })
  }

  async deleteMany(cartItems: CartItem[]): Promise<void> {
    if (cartItems.length === 0) {
      return
    }

    await this.prisma.cartItem.deleteMany({
      where: {
        id: {
          in: cartItems.map((cartItem) => cartItem.id.toString()),
        },
      },
    })
  }

  async findManyByCartId(cartId: string): Promise<CartItem[]> {
    const cartItem = await this.prisma.cartItem.findMany({
      where: {
        cartId,
      },
    })

    return cartItem.map(PrismaCartItemMapper.toDomain)
  }

  async deleteManyByCartId(cartId: string): Promise<void> {
    await this.prisma.cartItem.deleteMany({
      where: {
        cartId,
      },
    })
  }
}
