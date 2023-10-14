import { Order } from '@/domain/restaurant/enterprise/entities/order'

export interface OrderRepository {
  findById(id: string): Promise<Order | null>
  save(order: Order): Promise<void>
  create(order: Order): Promise<void>
}
