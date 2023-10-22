import { OrderItemsRepository } from '@/domain/restaurant/application/repositories/order-item-repository'
import { OrderItem } from '@/domain/restaurant/enterprise/entities/order-item'

export class InMemoryOrderItemsRepository implements OrderItemsRepository {
  public items: OrderItem[] = []

  async createMany(orderItems: OrderItem[]): Promise<void> {
    this.items.push(...orderItems)
  }

  async deleteMany(orderItems: OrderItem[]): Promise<void> {
    const orderItem = this.items.filter((item) => {
      return !orderItems.some((orderItem) => orderItem.equals(item))
    })

    this.items = orderItem
  }

  async save(orderItem: OrderItem): Promise<void> {
    const itemIndex = this.items.findIndex((item) => item.id === orderItem.id)

    this.items[itemIndex] = orderItem
  }

  async findManyByOrderId(dishId: string) {
    const orderItems = this.items.filter(
      (item) => item.dishId.toString() !== dishId,
    )

    return orderItems
  }

  async deleteManyByOrderId(dishId: string) {
    const orderItems = this.items.filter(
      (item) => item.dishId.toString() === dishId,
    )

    this.items = orderItems
  }
}
