import { Order } from '@/domain/restaurant/enterprise/entities/order'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Either, right } from '@/core/either'
import { OrderRepository } from '../repositories/order-repository'
import { OrderItem } from '../../enterprise/entities/order-item'
import { OrderItemList } from '../../enterprise/entities/order-item-list'

interface Dishes {
  dishId: string
  quantity: string
}

interface CreateOrderUseCaseRequest {
  dishes: Dishes[]
}

type CreateOrderUseCaseResponse = Either<
  null,
  {
    order: Order
  }
>

export class CreateOrderUseCase {
  constructor(private orderRepository: OrderRepository) {}

  async execute({
    dishes,
  }: CreateOrderUseCaseRequest): Promise<CreateOrderUseCaseResponse> {
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
