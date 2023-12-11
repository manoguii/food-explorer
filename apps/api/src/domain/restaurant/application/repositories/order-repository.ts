import { Order } from '@/domain/restaurant/enterprise/entities/order'
import { OrderWithDetails } from '../../enterprise/entities/value-objects/order-with-details'

export abstract class OrderRepository {
  abstract findById(id: string): Promise<Order | null>
  abstract findManyByClientId(clientId: string): Promise<{
    orders: Order[]
  }>

  abstract findByIdWithDetails(id: string): Promise<OrderWithDetails | null>

  abstract save(order: Order): Promise<void>
  abstract create(order: Order): Promise<void>
}
