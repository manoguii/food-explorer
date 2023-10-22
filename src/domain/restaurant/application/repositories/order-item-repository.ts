import { OrderItem } from '../../enterprise/entities/order-item'

export abstract class OrderItemsRepository {
  abstract createMany(orders: OrderItem[]): Promise<void>
  abstract deleteMany(orders: OrderItem[]): Promise<void>

  abstract findManyByOrderId(orderId: string): Promise<OrderItem[]>
  abstract deleteManyByOrderId(orderId: string): Promise<void>
}
