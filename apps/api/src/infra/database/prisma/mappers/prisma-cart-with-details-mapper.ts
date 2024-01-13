import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { CartWithDetails } from '@/domain/restaurant/enterprise/entities/value-objects/cart-with-details'
import {
  Cart as PrismaCart,
  CartItem,
  Dish,
  Attachment as PrismaAttachment,
  User,
} from '@prisma/client'

type CartWithDetailsProps = PrismaCart & {
  cartItems: (CartItem & {
    dish: Dish & {
      attachments: PrismaAttachment[]
    }
  })[]
  user: User
}

export class PrismaCartWithDetailsMapper {
  static toDomain(raw: CartWithDetailsProps): CartWithDetails {
    return CartWithDetails.create({
      cartId: new UniqueEntityID(raw.id),
      totalAmount: raw.totalAmount,
      checkoutUrl: raw.checkoutUrl,
      dishes: raw.cartItems.map((cartItem) => {
        return {
          id: cartItem.dish.id,
          name: cartItem.dish.name,
          description: cartItem.dish.description,
          price: cartItem.dish.price,
          slug: cartItem.dish.slug,
          attachments: cartItem.dish.attachments.map((attachment) => {
            return {
              id: attachment.id,
              title: attachment.title,
              url: attachment.url,
            }
          }),
          quantity: cartItem.quantity,
        }
      }),
      client: {
        id: raw.user.id,
        name: raw.user.name,
        email: raw.user.email,
      },
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    })
  }
}
