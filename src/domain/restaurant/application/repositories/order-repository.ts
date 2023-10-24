import { PaginationParams } from '@/core/repositories/pagination-params'
import { Order } from '@/domain/restaurant/enterprise/entities/order'

export abstract class OrderRepository {
  abstract findById(id: string): Promise<Order | null>
  abstract findManyByClientId(
    clientId: string,
    params: PaginationParams,
  ): Promise<Order[]>

  abstract save(order: Order): Promise<void>
  abstract create(order: Order): Promise<void>
}
