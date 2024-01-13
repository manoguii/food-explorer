import { Cart } from '@/domain/restaurant/enterprise/entities/cart'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { CartRepository } from '@/domain/restaurant/application/repositories/cart-repository'
import { PrismaCartMapper } from '../mappers/prisma-cart-mapper'
import { CartItemsRepository } from '@/domain/restaurant/application/repositories/cart-item-repository'
import { CartWithDetails } from '@/domain/restaurant/enterprise/entities/value-objects/cart-with-details'
import { PrismaCartWithDetailsMapper } from '../mappers/prisma-cart-with-details-mapper'

@Injectable()
export class PrismaCartRepository implements CartRepository {
  constructor(
    private prisma: PrismaService,
    private cartItemsRepository: CartItemsRepository,
  ) {}

  async findById(id: string): Promise<Cart | null> {
    const cart = await this.prisma.cart.findUnique({
      where: {
        id,
      },
    })

    if (!cart) {
      return null
    }

    return PrismaCartMapper.toDomain(cart)
  }

  async create(cart: Cart): Promise<void> {
    const data = PrismaCartMapper.toPrisma(cart)

    await this.prisma.cart.create({
      data,
    })

    this.cartItemsRepository.createMany(cart.items.getItems())
  }

  async findByIdWithDetails(id: string): Promise<CartWithDetails | null> {
    const cart = await this.prisma.cart.findUnique({
      where: {
        id,
      },
      include: {
        cartItems: {
          include: {
            dish: {
              include: {
                attachments: true,
              },
            },
          },
        },
        user: true,
      },
    })

    if (!cart) {
      return null
    }

    return PrismaCartWithDetailsMapper.toDomain(cart)
  }

  async save(cart: Cart): Promise<void> {
    const data = PrismaCartMapper.toPrisma(cart)

    await Promise.all([
      this.prisma.cart.update({
        where: {
          id: cart.id.toString(),
        },
        data,
      }),
      this.cartItemsRepository.createMany(cart.items.getNewItems()),
      this.cartItemsRepository.deleteMany(cart.items.getRemovedItems()),
    ])
  }

  async delete(cart: Cart): Promise<void> {
    await this.prisma.cart.delete({
      where: {
        id: cart.id.toString(),
      },
    })
  }
}
