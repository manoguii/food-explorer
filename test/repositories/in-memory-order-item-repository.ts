import { OrderItemsRepository } from '@/domain/restaurant/application/repositories/order-item-repository'
import { OrderItem } from '@/domain/restaurant/enterprise/entities/order-item'

export class InMemoryOrderItemsRepository implements OrderItemsRepository {
  public items: OrderItem[] = []

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
