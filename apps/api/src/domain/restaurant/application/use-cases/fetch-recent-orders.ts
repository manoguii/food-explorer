import { Either, right } from '@/core/either'
import { Order } from '../../enterprise/entities/order'
import { OrderRepository } from '../repositories/order-repository'
import { Injectable } from '@nestjs/common'

interface FetchRecentOrderUseCaseRequest {
  clientId: string
}

type FetchRecentOrderUseCaseResponse = Either<
  null,
  {
    order: Order[]
  }
>

@Injectable()
export class FetchRecentOrderUseCase {
  constructor(private orderRepository: OrderRepository) {}

  async execute({
    clientId,
  }: FetchRecentOrderUseCaseRequest): Promise<FetchRecentOrderUseCaseResponse> {
    const { orders } = await this.orderRepository.findManyByClientId(clientId)

    return right({
      order: orders,
    })
  }
}
