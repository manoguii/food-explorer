import { CartRepository } from '@/domain/restaurant/application/repositories/cart-repository'
import { Cart } from '@/domain/restaurant/enterprise/entities/cart'
import { InMemoryCartItemsRepository } from './in-memory-cart-item-repository'
import { CartWithDetails } from '@/domain/restaurant/enterprise/entities/value-objects/cart-with-details'
import { InMemoryDishAttachmentsRepository } from './in-memory-dish-attachments-repository'
import { InMemoryAttachmentsRepository } from './in-memory-attachments-repository'
import { InMemoryDishRepository } from './in-memory-dish-repository'
import { InMemoryClientsRepository } from './in-memory-clients-repository'

export class InMemoryCartRepository implements CartRepository {
  public items: Cart[] = []

  constructor(
    private cartItemsRepository: InMemoryCartItemsRepository,
    private dishAttachmentsRepository: InMemoryDishAttachmentsRepository,
    private attachmentsRepository: InMemoryAttachmentsRepository,
    private dishRepository: InMemoryDishRepository,
    private clientsRepository: InMemoryClientsRepository,
  ) {}

  async findById(id: string) {
    const cart = this.items.find((item) => item.id.toString() === id)

    if (!cart) {
      return null
    }

    return cart
  }

  async create(cart: Cart) {
    this.items.push(cart)

    await Promise.all([
      this.cartItemsRepository.createMany(cart.items.getItems()),
    ])
  }

  async findEmptyCartByClientId(clientId: string): Promise<Cart | null> {
    const cart = this.items.find(
      (item) =>
        item.clientId.toString() === clientId &&
        item.items.currentItems.length === 0,
    )

    if (!cart) {
      return null
    }

    return cart
  }

  async findByIdWithDetails(id: string): Promise<CartWithDetails | null> {
    const cart = this.items.find((item) => item.id.toString() === id)

    if (!cart) {
      return null
    }

    const cartItems = await this.cartItemsRepository.findManyByCartId(
      cart.id.toString(),
    )

    const dishesWithDetails = await Promise.all(
      cartItems.map(async (item) => {
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
          updatedAt: item.updatedAt,
        }
      }),
    )

    const client = await this.clientsRepository.findById(
      cart.clientId.toString(),
    )

    if (!client) {
      throw new Error('Client not found !')
    }

    return CartWithDetails.create({
      cartId: cart.id,
      totalAmount: cart.totalAmount,
      dishes: dishesWithDetails,
      client: {
        id: client.id.toString(),
        name: client.name,
        email: client.email,
      },
      createdAt: cart.createdAt,
      updatedAt: cart.updatedAt,
    })
  }

  async save(cart: Cart) {
    const itemIndex = this.items.findIndex((item) => item.id === cart.id)

    this.items[itemIndex] = cart

    await Promise.all([
      this.cartItemsRepository.createMany(cart.items.getNewItems()),
      this.cartItemsRepository.deleteMany(cart.items.getRemovedItems()),
    ])
  }

  async delete(cart: Cart) {
    const itemIndex = this.items.findIndex((item) => item.id === cart.id)

    this.items.splice(itemIndex, 1)
  }
}
