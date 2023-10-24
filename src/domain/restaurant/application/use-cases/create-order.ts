import { Order } from '@/domain/restaurant/enterprise/entities/order'
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
  dishes: Dish[]
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
  }: CreateOrderUseCaseRequest): Promise<CreateOrderUseCaseResponse> {
    if (dishes.length <= 0) {
      return left(new InvalidOrderError())
    }

    for (const { dishId } of dishes) {
      const dish = await this.dishRepository.findById(dishId)

      if (!dish) {
        return left(new InvalidOrderError())
      }
    }

    const order = Order.create({})

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
