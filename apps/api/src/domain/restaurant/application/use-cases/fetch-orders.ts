import { Injectable } from '@nestjs/common'

import { Either, right } from '@/core/either'

import { OrderWithDetails } from '../../enterprise/entities/value-objects/order-with-details'
import { OrdersRepository } from '../repositories/orders-repository'

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
