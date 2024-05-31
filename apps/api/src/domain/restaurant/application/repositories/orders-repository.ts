import { PaginationParams } from '@/core/repositories/pagination-params'
import { Order } from '@/domain/restaurant/enterprise/entities/order'

import { OrderWithDetails } from '../../enterprise/entities/value-objects/order-with-details'

export type MetricsResponse = {
  value: number
}

export type OverviewResponse = {
  name: string
  total: number
}

export type RecentSalesResponse = {
  client: {
    id: string
    name: string
    email: string
    image?: string | null
  }
  total: number
}

export abstract class OrdersRepository {
  abstract findById(id: string): Promise<Order | null>
  abstract findByIdWithDetails(id: string): Promise<OrderWithDetails | null>
  abstract findManyByClientIdWithDetails(
    clientId: string,
    params: PaginationParams,
  ): Promise<{
    orders: OrderWithDetails[]
    totalPages: number
  }>

  abstract findAllWithDetails(params: PaginationParams): Promise<{
    orders: OrderWithDetails[]
    totalPages: number
  }>

  abstract save(order: Order): Promise<void>
  abstract create(order: Order): Promise<void>

  abstract getTotalRevenue(
    startDate: Date,
    endDate: Date,
  ): Promise<MetricsResponse>

  abstract getSales(startDate: Date, endDate: Date): Promise<MetricsResponse>

  abstract getActiveClients(
    startDate: Date,
    endDate: Date,
  ): Promise<MetricsResponse>

  abstract getRecentSales(
    startDate: Date,
    endDate: Date,
  ): Promise<RecentSalesResponse[]>

  abstract getOverview(): Promise<OverviewResponse[]>
}
