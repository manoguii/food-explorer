import { Either, left, right } from '@/core/either'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { Order } from '@/domain/restaurant/enterprise/entities/order'
import { OrderRepository } from '../repositories/order-repository'
import { OrderItemList } from '../../enterprise/entities/order-item-list'
import { OrderItem } from '../../enterprise/entities/order-item'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { OrderItemsRepository } from '../repositories/order-item-repository'

interface Dishes {
  dishId: string
  quantity: string
}

interface EditOrderUseCaseRequest {
  orderId: string
  dishes: Dishes[]
}

type EditOrderUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    order: Order
  }
>

export class EditOrderUseCase {
  constructor(
    private orderRepository: OrderRepository,
    private orderItemsRepository: OrderItemsRepository,
  ) {}

  async execute({
    orderId,
    dishes,
  }: EditOrderUseCaseRequest): Promise<EditOrderUseCaseResponse> {
    const order = await this.orderRepository.findById(orderId)

    if (!order) {
      return left(new ResourceNotFoundError())
    }

    const currentOrderItems = await this.orderItemsRepository.findManyByOrderId(
      orderId,
    )

    const orderItemsList = new OrderItemList(currentOrderItems)

    const orderItems = dishes.map(({ dishId, quantity }) => {
      return OrderItem.create({
        dishId: new UniqueEntityID(dishId),
        orderId: order.id,
        quantity,
      })
    })

    orderItemsList.update(orderItems)

    order.items = orderItemsList
    order.updateStatusBasedOnItems()

    await this.orderRepository.save(order)

    return right({
      order,
    })
  }
}
