import { OrderRepository } from '../repositories/order-repository'
import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { Injectable } from '@nestjs/common'
import { OrderWithDetails } from '../../enterprise/entities/value-objects/order-with-details'

interface GetOrderByIdUseCaseRequest {
  orderId: string
}

type GetOrderByIdUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    order: OrderWithDetails
  }
>

@Injectable()
export class GetOrderByIdUseCase {
  constructor(private orderRepository: OrderRepository) {}

  async execute({
    orderId,
  }: GetOrderByIdUseCaseRequest): Promise<GetOrderByIdUseCaseResponse> {
    const order = await this.orderRepository.findByIdWithDetails(orderId)

    if (!order) {
      return left(new ResourceNotFoundError())
    }

    return right({
      order,
    })
  }
}
