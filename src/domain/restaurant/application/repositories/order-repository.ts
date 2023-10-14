import { Order } from '@/domain/restaurant/enterprise/entities/order'

export abstract class OrderRepository {
  abstract findById(id: string): Promise<Order | null>
  abstract save(order: Order): Promise<void>
  abstract create(order: Order): Promise<void>
}
