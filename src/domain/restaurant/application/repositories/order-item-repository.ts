import { OrderItem } from '../../enterprise/entities/order-item'

export interface OrderItemsRepository {
  findManyByOrderId(orderId: string): Promise<OrderItem[]>
  deleteManyByOrderId(orderId: string): Promise<void>
}
