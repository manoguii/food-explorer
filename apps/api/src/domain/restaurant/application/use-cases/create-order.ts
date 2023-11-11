import {
  Label,
  Order,
  Priority,
} from '@/domain/restaurant/enterprise/entities/order'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Either, left, right } from '@/core/either'
import { OrderRepository } from '../repositories/order-repository'
import { OrderItem } from '../../enterprise/entities/order-item'
import { OrderItemList } from '../../enterprise/entities/order-item-list'
import { Injectable } from '@nestjs/common'
import { InvalidOrderError } from './errors/invalid-order-error'
import { DishRepository } from '../repositories/dish-repository'

type Dish = {
  dishId: string
  quantity: number
}

interface CreateOrderUseCaseRequest {
  clientId: string
  dishes: Dish[]
  label?: Label
  priority?: Priority
}

type CreateOrderUseCaseResponse = Either<
  InvalidOrderError,
  {
    order: Order
  }
>

@Injectable()
export class CreateOrderUseCase {
  constructor(
    private orderRepository: OrderRepository,
    private dishRepository: DishRepository,
  ) {}

  async execute({
    dishes,
    clientId,
    label,
    priority,
  }: CreateOrderUseCaseRequest): Promise<CreateOrderUseCaseResponse> {
    if (dishes.length <= 0) {
      return left(new InvalidOrderError())
    }

    const orderDetails: string[] = []

    for (const { dishId, quantity } of dishes) {
      const dishEntity = await this.dishRepository.findById(dishId)

      if (!dishEntity) {
        return left(new InvalidOrderError())
      }

      orderDetails.push(`${quantity} x ${dishEntity.name}`)
    }

    const order = Order.create({
      clientId: new UniqueEntityID(clientId),
      orderDetails: orderDetails.join(', '),
      label,
      priority,
    })

    const orderItems = dishes.map(({ dishId, quantity }) => {
      return OrderItem.create({
        orderId: order.id,
        dishId: new UniqueEntityID(dishId),
        quantity,
      })
    })

    order.items = new OrderItemList(orderItems)

    await this.orderRepository.create(order)

    return right({
      order,
    })
  }
}
