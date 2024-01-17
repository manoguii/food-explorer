import { Order } from '@/domain/restaurant/enterprise/entities/order'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { OrderRepository } from '@/domain/restaurant/application/repositories/orders-repository'
import { PrismaOrderMapper } from '../mappers/prisma-order-mapper'

@Injectable()
export class PrismaOrderRepository implements OrderRepository {
  constructor(private prisma: PrismaService) {}

  async findById(id: string): Promise<Order | null> {
    const order = await this.prisma.order.findUnique({
      where: {
        id,
      },
    })

    if (!order) {
      return null
    }

    return PrismaOrderMapper.toDomain(order)
  }

  async findManyByClientId(clientId: string): Promise<{
    orders: Order[]
  }> {
    const orders = await this.prisma.order.findMany({
      where: {
        userId: clientId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return {
      orders: orders.map(PrismaOrderMapper.toDomain),
    }
  }

  async create(order: Order): Promise<void> {
    const data = PrismaOrderMapper.toPrisma(order)

    await this.prisma.order.create({
      data,
    })
  }

  async save(order: Order): Promise<void> {
    const data = PrismaOrderMapper.toPrisma(order)

    await Promise.all([
      this.prisma.order.update({
        where: {
          id: order.id.toString(),
        },
        data,
      }),
    ])
  }
}
