import { Dish } from '../../enterprise/entities/dish'
import { Order } from '../../enterprise/entities/order'
import { Price } from '../../enterprise/entities/value-objects/price'
import { OrderRepository } from '../repositories/order-repository'

interface CreateOrderUseCaseRequest {
  userId: string
  dishes: Dish[]
  total: number
  paymentMethod: 'credit' | 'pix'
}

interface CreateOrderUseCaseResponse {
  order: Order
}

export class CreateOrderUseCase {
  constructor(private orderRepository: OrderRepository) {}

  async execute({
    userId,
    dishes,
    total,
    paymentMethod,
  }: CreateOrderUseCaseRequest): Promise<CreateOrderUseCaseResponse> {
    const order = Order.create({
      userId,
      dishes,
      total: Price.fromCents(total),
      paymentMethod,
    })

    await this.orderRepository.create(order)

    return { order }
  }
}
