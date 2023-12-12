import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import {
  Label,
  Order,
  Priority,
} from '@/domain/restaurant/enterprise/entities/order'
import { OrderRepository } from '../repositories/order-repository'
import { Injectable } from '@nestjs/common'
import { InvalidOrderError } from './errors/invalid-order-error'

interface EditOrderUseCaseRequest {
  orderId: string
  priority?: Priority
  label?: Label
}

type EditOrderUseCaseResponse = Either<
  ResourceNotFoundError | InvalidOrderError,
  {
    order: Order
  }
>

@Injectable()
export class EditOrderUseCase {
  constructor(private orderRepository: OrderRepository) {}

  async execute({
    orderId,
    label,
    priority,
  }: EditOrderUseCaseRequest): Promise<EditOrderUseCaseResponse> {
    const order = await this.orderRepository.findById(orderId)

    if (!order) {
      return left(new ResourceNotFoundError())
    }

    if (priority) order.priority = priority

    if (label) order.label = label

    await this.orderRepository.save(order)

    return right({
      order,
    })
  }
}
