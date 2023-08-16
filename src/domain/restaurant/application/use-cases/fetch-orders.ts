import { Order } from '../../enterprise/entities/order'
import { OrderRepository } from '../repositories/order-repository'

interface FetchOrdersUseCaseRequest {
  page: number
}

interface FetchOrdersUseCaseResponse {
  orders: Order[]
}

export class FetchOrdersUseCase {
  constructor(private orderRepository: OrderRepository) {}

  async execute({
    page,
  }: FetchOrdersUseCaseRequest): Promise<FetchOrdersUseCaseResponse> {
    const orders = await this.orderRepository.findManyRecent({
      page,
    })

    if (!orders) {
      throw new Error('Order not found !')
    }

    return { orders }
  }
}
