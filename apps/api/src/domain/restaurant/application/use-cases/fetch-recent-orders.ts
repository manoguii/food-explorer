import { Either, right } from '@/core/either'
import { Order } from '../../enterprise/entities/order'
import { OrderRepository } from '../repositories/order-repository'
import { Injectable } from '@nestjs/common'

interface FetchRecentOrderUseCaseRequest {
  clientId: string
  page: number
}

type FetchRecentOrderUseCaseResponse = Either<
  null,
  {
    order: Order[]
    totalPages
  }
>

@Injectable()
export class FetchRecentOrderUseCase {
  constructor(private orderRepository: OrderRepository) {}

  async execute({
    clientId,
    page,
  }: FetchRecentOrderUseCaseRequest): Promise<FetchRecentOrderUseCaseResponse> {
    const { orders, totalPages } =
      await this.orderRepository.findManyByClientId(clientId, {
        page,
      })

    return right({
      order: orders,
      totalPages,
    })
  }
}
