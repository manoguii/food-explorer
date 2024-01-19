import { Either, right } from '@/core/either'
import { OrdersRepository } from '../repositories/orders-repository'
import { Injectable } from '@nestjs/common'
import { OrderWithDetails } from '../../enterprise/entities/value-objects/order-with-details'

interface FetchOrdersUseCaseRequest {
  clientId: string
  page: number
}

type FetchOrdersUseCaseResponse = Either<
  null,
  {
    orders: OrderWithDetails[]
    totalPages: number
  }
>

@Injectable()
export class FetchOrdersUseCase {
  constructor(private ordersRepository: OrdersRepository) {}

  async execute({
    clientId,
    page,
  }: FetchOrdersUseCaseRequest): Promise<FetchOrdersUseCaseResponse> {
    const { orders, totalPages } =
      await this.ordersRepository.findManyByClientIdWithDetails(clientId, {
        page,
      })

    return right({
      orders,
      totalPages,
    })
  }
}
