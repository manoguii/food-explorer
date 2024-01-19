import { Either, left, right } from '@/core/either'
import { OrdersRepository } from '../repositories/orders-repository'
import { Injectable } from '@nestjs/common'
import { ClientsRepository } from '../repositories/clients-repository'
import { ClientNotFoundError } from './errors/client-not-found-error'
import { UnauthorizedError } from './errors/unauthorized-error'
import { OrderWithDetails } from '../../enterprise/entities/value-objects/order-with-details'

interface FetchAllOrdersUseCaseRequest {
  clientId: string
  page: number
}

type FetchAllOrdersUseCaseResponse = Either<
  ClientNotFoundError | UnauthorizedError,
  {
    orders: OrderWithDetails[]
    totalPages: number
  }
>

@Injectable()
export class FetchAllOrdersUseCase {
  constructor(
    private ordersRepository: OrdersRepository,
    private clientsRepository: ClientsRepository,
  ) {}

  async execute({
    clientId,
    page,
  }: FetchAllOrdersUseCaseRequest): Promise<FetchAllOrdersUseCaseResponse> {
    const client = await this.clientsRepository.findById(clientId)

    if (!client) {
      return left(new ClientNotFoundError(clientId))
    }

    if (!client.isAdmin()) {
      return left(new UnauthorizedError(clientId))
    }

    const { orders, totalPages } =
      await this.ordersRepository.findAllWithDetails({
        page,
      })

    return right({
      orders,
      totalPages,
    })
  }
}
