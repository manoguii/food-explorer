import { OrderItem } from '../../enterprise/entities/order-item'

export abstract class OrderItemsRepository {
  abstract findManyByOrderId(orderId: string): Promise<OrderItem[]>
  abstract deleteManyByOrderId(orderId: string): Promise<void>
}
