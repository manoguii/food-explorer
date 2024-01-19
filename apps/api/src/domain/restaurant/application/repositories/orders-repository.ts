import { PaginationParams } from '@/core/repositories/pagination-params'
import { Order } from '@/domain/restaurant/enterprise/entities/order'
import { OrderWithDetails } from '../../enterprise/entities/value-objects/order-with-details'

export abstract class OrdersRepository {
  abstract findById(id: string): Promise<Order | null>
  abstract findManyByClientIdWithDetails(
    clientId: string,
    params: PaginationParams,
  ): Promise<{
    orders: OrderWithDetails[]
    totalPages: number
  }>

  abstract findByIdWithDetails(id: string): Promise<OrderWithDetails | null>

  abstract findAllWithDetails(params: PaginationParams): Promise<{
    orders: OrderWithDetails[]
    totalPages: number
  }>

  abstract save(order: Order): Promise<void>
  abstract create(order: Order): Promise<void>
}
