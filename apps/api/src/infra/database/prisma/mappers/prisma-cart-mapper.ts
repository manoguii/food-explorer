import { Cart as PrismaCart, Prisma } from '@prisma/client'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Cart } from '@/domain/restaurant/enterprise/entities/cart'

export class PrismaCartMapper {
  static toDomain(raw: PrismaCart): Cart {
    return Cart.create(
      {
        clientId: new UniqueEntityID(raw.userId),
        totalAmount: raw.totalAmount,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPrisma(cart: Cart): Prisma.CartUncheckedCreateInput {
    return {
      id: cart.id.toString(),
      userId: cart.clientId.toString(),
      totalAmount: cart.totalAmount,
      createdAt: cart.createdAt,
      updatedAt: cart.updatedAt,
    }
  }
}
