import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { PrismaOrderItemMapper } from '../mappers/prisma-order-item-mapper'
import { OrderItemsRepository } from '@/domain/restaurant/application/repositories/order-item-repository'
import { OrderItem } from '@/domain/restaurant/enterprise/entities/order-item'

@Injectable()
export class PrismaOrderItemsRepository implements OrderItemsRepository {
  constructor(private prisma: PrismaService) {}

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
