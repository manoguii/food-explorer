import { OrderItem } from '../../enterprise/entities/order-item'

export abstract class OrderItemsRepository {
  abstract createMany(orderItems: OrderItem[]): Promise<void>
  abstract deleteMany(orderItems: OrderItem[]): Promise<void>
  abstract save(orderItem: OrderItem): Promise<void>
  abstract findManyByOrderId(orderId: string): Promise<OrderItem[]>
  abstract deleteManyByOrderId(orderId: string): Promise<void>
}
