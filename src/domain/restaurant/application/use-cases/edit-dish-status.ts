import { Either, left, right } from '@/core/either'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import {
  Order,
  OrderStatus,
} from '@/domain/restaurant/enterprise/entities/order'
import { OrderRepository } from '../repositories/order-repository'
import { OrderItemsRepository } from '../repositories/order-item-repository'

interface EditOrderStatusUseCaseRequest {
  orderId: string
  dishId: string
  status: OrderStatus
}

type EditOrderStatusUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    order: Order
  }
>

export class EditOrderStatusUseCase {
  constructor(
    private orderRepository: OrderRepository,
    private orderItemsRepository: OrderItemsRepository,
  ) {}

  async execute({
    orderId,
    dishId,
    status,
  }: EditOrderStatusUseCaseRequest): Promise<EditOrderStatusUseCaseResponse> {
    const order = await this.orderRepository.findById(orderId)

    if (!order) {
      return left(new ResourceNotFoundError())
    }

    const currentOrderItems = await this.orderItemsRepository.findManyByOrderId(
      order.id.toString(),
    )

    currentOrderItems.forEach((item) => {
      if (item.dishId.toString() === dishId) {
        item.status = status
      }
    })

    order.updateStatusBasedOnItems()

    await this.orderRepository.save(order)

    return right({
      order,
    })
  }
}
