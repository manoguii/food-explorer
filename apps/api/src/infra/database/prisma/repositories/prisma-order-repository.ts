import { Order } from '@/domain/restaurant/enterprise/entities/order'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { OrderRepository } from '@/domain/restaurant/application/repositories/order-repository'
import { PrismaOrderMapper } from '../mappers/prisma-order-mapper'
import { OrderItemsRepository } from '@/domain/restaurant/application/repositories/order-item-repository'
import { OrderWithDetails } from '@/domain/restaurant/enterprise/entities/value-objects/order-with-details'
import { PrismaOrderWithDetailsMapper } from '../mappers/prisma-order-with-details-mapper'

@Injectable()
export class PrismaOrderRepository implements OrderRepository {
  constructor(
    private prisma: PrismaService,
    private orderItemsRepository: OrderItemsRepository,
  ) {}

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

    this.orderItemsRepository.createMany(order.items.getItems())
  }

  async findByIdWithDetails(id: string): Promise<OrderWithDetails | null> {
    const order = await this.prisma.order.findUnique({
      where: {
        id,
      },
      include: {
        orderItems: {
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

    if (!order) {
      return null
    }

    return PrismaOrderWithDetailsMapper.toDomain(order)
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
      this.orderItemsRepository.createMany(order.items.getNewItems()),
      this.orderItemsRepository.deleteMany(order.items.getRemovedItems()),
    ])
  }
}
