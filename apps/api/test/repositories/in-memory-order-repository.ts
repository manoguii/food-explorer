import { OrderRepository } from '@/domain/restaurant/application/repositories/order-repository'
import { Order } from '@/domain/restaurant/enterprise/entities/order'
import { InMemoryOrderItemsRepository } from './in-memory-order-item-repository'
import { OrderWithDetails } from '@/domain/restaurant/enterprise/entities/value-objects/order-with-details'
import { InMemoryDishAttachmentsRepository } from './in-memory-dish-attachments-repository'
import { InMemoryAttachmentsRepository } from './in-memory-attachments-repository'
import { InMemoryDishRepository } from './in-memory-dish-repository'

export class InMemoryOrderRepository implements OrderRepository {
  public items: Order[] = []

  constructor(
    private orderItemsRepository: InMemoryOrderItemsRepository,
    private dishAttachmentsRepository: InMemoryDishAttachmentsRepository,
    private attachmentsRepository: InMemoryAttachmentsRepository,
    private dishRepository: InMemoryDishRepository,
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

    await Promise.all([
      this.orderItemsRepository.createMany(order.items.getItems()),
    ])
  }

  async findByIdWithDetails(id: string): Promise<OrderWithDetails | null> {
    const order = this.items.find((item) => item.id.toString() === id)

    if (!order) {
      return null
    }

    const orderItems = await this.orderItemsRepository.findManyByOrderId(
      order.id.toString(),
    )

    const dishesWithDetails = await Promise.all(
      orderItems.map(async (item) => {
        const dish = await this.dishRepository.findById(item.dishId.toString())

        if (!dish) {
          throw new Error('Dish not found !')
        }

        const dishAttachments =
          await this.dishAttachmentsRepository.findManyByDishId(
            dish.id.toString(),
          )

        const attachments = dishAttachments.map((dishAttachment) => {
          const attachment = this.attachmentsRepository.items.find(
            (attachment) => attachment.id.equals(dishAttachment.attachmentId),
          )

          if (!attachment) {
            throw new Error(
              'A dish cannot be created without an dish attachment !',
            )
          }

          return {
            id: attachment.id.toString(),
            title: attachment.title,
            url: attachment.url,
          }
        })

        return {
          id: dish.id.toString(),
          name: dish.name,
          description: dish.description,
          price: dish.price,
          slug: dish.slug.value,
          attachments,
          quantity: item.quantity,
          status: item.status,
          updatedAt: item.updatedAt,
        }
      }),
    )

    return OrderWithDetails.create({
      orderId: order.id,
      code: order.code.value,
      status: order.status,
      label: order.label,
      priority: order.priority,
      dishes: dishesWithDetails,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    })
  }

  async save(order: Order) {
    const itemIndex = this.items.findIndex((item) => item.id === order.id)

    this.items[itemIndex] = order

    await Promise.all([
      this.orderItemsRepository.createMany(order.items.getNewItems()),
      this.orderItemsRepository.deleteMany(order.items.getRemovedItems()),
    ])
  }
}
