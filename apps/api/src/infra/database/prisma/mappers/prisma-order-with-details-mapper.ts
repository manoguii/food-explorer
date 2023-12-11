import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { OrderWithDetails } from '@/domain/restaurant/enterprise/entities/value-objects/order-with-details'
import {
  Order as PrismaOrder,
  OrderItem,
  Dish,
  Attachment as PrismaAttachment,
} from '@prisma/client'

type OrderWithDetailsProps = PrismaOrder & {
  orderItems: (OrderItem & {
    dish: Dish & {
      attachments: PrismaAttachment[]
    }
  })[]
}

export class PrismaOrderWithDetailsMapper {
  static toDomain(raw: OrderWithDetailsProps): OrderWithDetails {
    return OrderWithDetails.create({
      orderId: new UniqueEntityID(raw.id),
      code: raw.code,
      status: raw.status,
      dishes: raw.orderItems.map((orderItem) => {
        return {
          id: orderItem.dish.id,
          name: orderItem.dish.name,
          description: orderItem.dish.description,
          price: orderItem.dish.price,
          slug: orderItem.dish.slug,
          attachments: orderItem.dish.attachments.map((attachment) => {
            return {
              id: attachment.id,
              title: attachment.title,
              url: attachment.url,
            }
          }),
          quantity: orderItem.quantity,
          status: orderItem.status,
        }
      }),
      priority: raw.priority,
      label: raw.label,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    })
  }
}
