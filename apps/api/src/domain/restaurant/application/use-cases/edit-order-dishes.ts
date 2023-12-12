import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { Order } from '@/domain/restaurant/enterprise/entities/order'
import { OrderRepository } from '../repositories/order-repository'
import { OrderItemList } from '../../enterprise/entities/order-item-list'
import { OrderItem } from '../../enterprise/entities/order-item'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { OrderItemsRepository } from '../repositories/order-item-repository'
import { Injectable } from '@nestjs/common'
import { InvalidOrderError } from './errors/invalid-order-error'
import { DishRepository } from '../repositories/dish-repository'

interface Dish {
  dishId: string
  quantity: number
}

interface EditOrderUseCaseRequest {
  orderId: string
  dishes: Dish[]
}

type EditOrderUseCaseResponse = Either<
  ResourceNotFoundError | InvalidOrderError,
  {
    order: Order
  }
>

@Injectable()
export class EditOrderUseCase {
  constructor(
    private orderRepository: OrderRepository,
    private orderItemsRepository: OrderItemsRepository,
    private dishRepository: DishRepository,
  ) {}

  async execute({
    orderId,
    dishes,
  }: EditOrderUseCaseRequest): Promise<EditOrderUseCaseResponse> {
    const order = await this.orderRepository.findById(orderId)

    if (!order) {
      return left(new ResourceNotFoundError())
    }

    const orderDetails: string[] = []

    for (const { dishId, quantity } of dishes) {
      const dishEntity = await this.dishRepository.findById(dishId)

      if (!dishEntity) {
        return left(new InvalidOrderError())
      }

      orderDetails.push(`${quantity} x ${dishEntity.name}`)
    }

    const currentOrderItems =
      await this.orderItemsRepository.findManyByOrderId(orderId)

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
    order.orderDetails = orderDetails.join(', ')

    const allItemsDelivered = currentOrderItems.every((item) =>
      item.isDelivered(),
    )

    const allItemsCanceled = currentOrderItems.every((item) =>
      item.isCanceled(),
    )

    if (allItemsCanceled) {
      order.status = 'CANCELED'
    } else if (allItemsDelivered) {
      order.status = 'DELIVERED'
    } else {
      order.status = 'PREPARING'
    }

    await this.orderRepository.save(order)

    return right({
      order,
    })
  }
}
