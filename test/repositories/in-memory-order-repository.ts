import { OrderRepository } from '@/domain/restaurant/application/repositories/order-repository'
import { Order } from '@/domain/restaurant/enterprise/entities/order'
import { InMemoryOrderItemsRepository } from './in-memory-order-item-repository'
import { PaginationParams } from '@/core/repositories/pagination-params'

export class InMemoryOrderRepository implements OrderRepository {
  public items: Order[] = []

  constructor(private orderItemsRepository: InMemoryOrderItemsRepository) {}

  async findById(id: string) {
    const order = this.items.find((item) => item.id.toString() === id)

    if (!order) {
      return null
    }

    return order
  }

  async findManyByClientId(
    clientId: string,
    { page }: PaginationParams,
  ): Promise<Order[]> {
    const orders = this.items.filter(
      (item) => item.clientId.toString() === clientId,
    )

    return orders.slice((page - 1) * 20, page * 20)
  }

  async create(order: Order) {
    this.items.push(order)

    await Promise.all([
      this.orderItemsRepository.createMany(order.items.getItems()),
    ])
  }

  async save(order: Order) {
    const itemIndex = this.items.findIndex((item) => item.id === order.id)

    this.items[itemIndex] = order

    await Promise.all([
      this.orderItemsRepository.createMany(order.items.getNewItems()),
      this.orderItemsRepository.deleteMany(order.items.getRemovedItems()),
    ])
  }
}
