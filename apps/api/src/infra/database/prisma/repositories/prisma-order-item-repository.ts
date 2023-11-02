import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { PrismaOrderItemMapper } from '../mappers/prisma-order-item-mapper'
import { OrderItemsRepository } from '@/domain/restaurant/application/repositories/order-item-repository'
import { OrderItem } from '@/domain/restaurant/enterprise/entities/order-item'

@Injectable()
export class PrismaOrderItemsRepository implements OrderItemsRepository {
  constructor(private prisma: PrismaService) {}

  async save(orderItem: OrderItem): Promise<void> {
    const data = PrismaOrderItemMapper.toPrisma(orderItem)

    await this.prisma.orderItem.update({
      where: {
        id: data.id,
      },
      data,
    })
  }

  async createMany(orderItems: OrderItem[]): Promise<void> {
    if (orderItems.length === 0) {
      return
    }

    await this.prisma.orderItem.createMany({
      data: orderItems.map((orderItem) =>
        PrismaOrderItemMapper.toPrisma(orderItem),
      ),
    })
  }

  async deleteMany(orderItems: OrderItem[]): Promise<void> {
    if (orderItems.length === 0) {
      return
    }

    await this.prisma.orderItem.deleteMany({
      where: {
        id: {
          in: orderItems.map((orderItem) => orderItem.id.toString()),
        },
      },
    })
  }

  async findManyByOrderId(orderId: string): Promise<OrderItem[]> {
    const orderItem = await this.prisma.orderItem.findMany({
      where: {
        orderId,
      },
    })

    return orderItem.map(PrismaOrderItemMapper.toDomain)
  }

  async deleteManyByOrderId(orderId: string): Promise<void> {
    await this.prisma.orderItem.deleteMany({
      where: {
        orderId,
      },
    })
  }
}
