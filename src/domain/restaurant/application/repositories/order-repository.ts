import { PaginationParams } from '@/core/repositories/pagination-params'
import { Order } from '../../enterprise/entities/order'

export interface OrderRepository {
  create(order: Order): Promise<void>
  save(order: Order): Promise<void>
  findManyRecent(params: PaginationParams): Promise<Order[] | null>
  findById(id: string): Promise<Order | null>
}
