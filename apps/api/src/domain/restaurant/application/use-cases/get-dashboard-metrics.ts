import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { Injectable } from '@nestjs/common'
import {
  MetricsResponse,
  OrdersRepository,
  OverviewResponse,
  RecentSalesResponse,
} from '../repositories/orders-repository'
import { ClientsRepository } from '../repositories/clients-repository'
import { UnauthorizedError } from './errors/unauthorized-error'

interface GetDashboardMetricsUseCaseRequest {
  clientId: string
  startDate: Date
  endDate: Date
}

type GetDashboardMetricsUseCaseResponse = Either<
  ResourceNotFoundError | UnauthorizedError,
  {
    sales: MetricsResponse
    totalRevenue: MetricsResponse
    activeClients: MetricsResponse
    recentSales: RecentSalesResponse[]
    overview: OverviewResponse[]
  }
>

@Injectable()
export class GetDashboardMetricsUseCase {
  constructor(
    private ordersRepository: OrdersRepository,
    private clientsRepository: ClientsRepository,
  ) {}

  async execute({
    clientId,
    startDate,
    endDate,
  }: GetDashboardMetricsUseCaseRequest): Promise<GetDashboardMetricsUseCaseResponse> {
    const client = await this.clientsRepository.findById(clientId)

    if (!client) {
      return left(new ResourceNotFoundError())
    }

    if (!client.isAdmin()) {
      return left(new UnauthorizedError(clientId))
    }

    const [sales, recentSales, totalRevenue, activeClients, overview] =
      await Promise.all([
        this.ordersRepository.getSales(startDate, endDate),
        this.ordersRepository.getRecentSales(startDate, endDate),
        this.ordersRepository.getTotalRevenue(startDate, endDate),
        this.ordersRepository.getActiveClients(startDate, endDate),
        this.ordersRepository.getOverview(),
      ])

    const metrics = {
      sales,
      recentSales,
      totalRevenue,
      activeClients,
      overview,
    }

    return right(metrics)
  }
}
