import { OrderRepository } from '@/domain/restaurant/application/repositories/order-repository'
import { Order } from '@/domain/restaurant/enterprise/entities/order'
import { InMemoryOrderItemsRepository } from './in-memory-order-item-repository'

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
