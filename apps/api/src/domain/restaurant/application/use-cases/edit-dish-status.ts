import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import {
  Order,
  OrderStatus,
} from '@/domain/restaurant/enterprise/entities/order'
import { OrderRepository } from '../repositories/order-repository'
import { OrderItemsRepository } from '../repositories/order-item-repository'
import { Injectable } from '@nestjs/common'

interface EditDishStatusUseCaseRequest {
  orderId: string
  dishId: string
  status: OrderStatus
}

type EditDishStatusUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    order: Order
  }
>

@Injectable()
export class EditDishStatusUseCase {
  constructor(
    private orderRepository: OrderRepository,
    private orderItemsRepository: OrderItemsRepository,
  ) {}

  async execute({
    orderId,
    dishId,
    status,
  }: EditDishStatusUseCaseRequest): Promise<EditDishStatusUseCaseResponse> {
    const order = await this.orderRepository.findById(orderId)

    if (!order) {
      return left(new ResourceNotFoundError())
    }

    const currentOrderItems = await this.orderItemsRepository.findManyByOrderId(
      order.id.toString(),
    )

    const dishIndex = currentOrderItems.findIndex(
      (item) => item.dishId.toString() === dishId,
    )

    currentOrderItems[dishIndex].status = status

    await this.orderItemsRepository.save(currentOrderItems[dishIndex])

    order.updateStatusBasedOnItems()

    await this.orderRepository.save(order)

    return right({
      order,
    })
  }
}
