import { Either, left, right } from '@/core/either'
import { Order } from '../../enterprise/entities/order'
import { OrderRepository } from '../repositories/order-repository'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'

interface FetchOrdersUseCaseRequest {
  page: number
}

type FetchOrdersUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    orders: Order[]
  }
>

export class FetchOrdersUseCase {
  constructor(private orderRepository: OrderRepository) {}

  async execute({
    page,
  }: FetchOrdersUseCaseRequest): Promise<FetchOrdersUseCaseResponse> {
    const orders = await this.orderRepository.findManyRecent({
      page,
    })

    if (!orders) {
      return left(new ResourceNotFoundError())
    }

    return right({ orders })
  }
}
