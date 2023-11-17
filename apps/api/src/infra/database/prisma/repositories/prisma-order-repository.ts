import { PaginationParams } from '@/core/repositories/pagination-params'
import { Order } from '@/domain/restaurant/enterprise/entities/order'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { OrderRepository } from '@/domain/restaurant/application/repositories/order-repository'
import { PrismaOrderMapper } from '../mappers/prisma-order-mapper'
import { OrderItemsRepository } from '@/domain/restaurant/application/repositories/order-item-repository'

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

  async findManyByClientId(
    clientId: string,
    params: PaginationParams,
  ): Promise<Order[]> {
    const orders = await this.prisma.order.findMany({
      where: {
        userId: clientId,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 20,
      skip: (params.page - 1) * 20,
    })

    return orders.map(PrismaOrderMapper.toDomain)
  }

  async create(order: Order): Promise<void> {
    const data = PrismaOrderMapper.toPrisma(order)

    await this.prisma.order.create({
      data,
    })

    this.orderItemsRepository.createMany(order.items.getItems())
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
