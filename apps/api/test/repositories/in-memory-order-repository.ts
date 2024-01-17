import { Order } from '@/domain/restaurant/enterprise/entities/order'
import { InMemoryDishAttachmentsRepository } from './in-memory-dish-attachments-repository'
import { InMemoryAttachmentsRepository } from './in-memory-attachments-repository'
import { InMemoryDishRepository } from './in-memory-dish-repository'
import { InMemoryClientsRepository } from './in-memory-clients-repository'
import { OrderRepository } from '@/domain/restaurant/application/repositories/orders-repository'

export class InMemoryOrderRepository implements OrderRepository {
  public items: Order[] = []

  constructor(
    private dishAttachmentsRepository: InMemoryDishAttachmentsRepository,
    private attachmentsRepository: InMemoryAttachmentsRepository,
    private dishRepository: InMemoryDishRepository,
    private clientsRepository: InMemoryClientsRepository,
  ) {}

  async findById(id: string) {
    const order = this.items.find((item) => item.id.toString() === id)

    if (!order) {
      return null
    }

    return order
  }

  async findManyByClientId(clientId: string): Promise<{
    orders: Order[]
  }> {
    const orders = this.items.filter(
      (item) => item.clientId.toString() === clientId,
    )

    return {
      orders,
    }
  }

  async create(order: Order) {
    this.items.push(order)
  }

  async save(order: Order) {
    const itemIndex = this.items.findIndex((item) => item.id === order.id)

    this.items[itemIndex] = order
  }
}
