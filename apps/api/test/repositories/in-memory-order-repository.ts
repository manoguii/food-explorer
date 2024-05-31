import { PaginationParams } from '@/core/repositories/pagination-params'
import {
  MetricsResponse,
  OrdersRepository,
  RecentSalesResponse,
} from '@/domain/restaurant/application/repositories/orders-repository'
import { Order } from '@/domain/restaurant/enterprise/entities/order'
import { OrderWithDetails } from '@/domain/restaurant/enterprise/entities/value-objects/order-with-details'

import { InMemoryAttachmentsRepository } from './in-memory-attachments-repository'
import { InMemoryCartItemsRepository } from './in-memory-cart-item-repository'
import { InMemoryCartRepository } from './in-memory-cart-repository'
import { InMemoryClientsRepository } from './in-memory-clients-repository'
import { InMemoryDishAttachmentsRepository } from './in-memory-dish-attachments-repository'
import { InMemoryDishIngredientsRepository } from './in-memory-dish-ingredients-repository'
import { InMemoryDishRepository } from './in-memory-dish-repository'

export class InMemoryOrdersRepository implements OrdersRepository {
  public items: Order[] = []

  constructor(
    private dishAttachmentsRepository: InMemoryDishAttachmentsRepository,
    private attachmentsRepository: InMemoryAttachmentsRepository,
    private dishRepository: InMemoryDishRepository,
    private cartsRepository: InMemoryCartRepository,
    private cartItemsRepository: InMemoryCartItemsRepository,
    private dishIngredientsRepository: InMemoryDishIngredientsRepository,
    private clientsRepository: InMemoryClientsRepository,
  ) {}

  getOverview(): Promise<{ name: string; total: number }[]> {
    throw new Error('Method not implemented.')
  }

  async getTotalRevenue(
    startDate: Date,
    endDate: Date,
  ): Promise<MetricsResponse> {
    const totalRevenue = this.items.reduce((acc, order) => {
      if (
        order.createdAt.getTime() >= startDate.getTime() &&
        order.createdAt.getTime() <= endDate.getTime()
      ) {
        return acc + order.amountTotal
      }

      return acc
    }, 0)

    return {
      value: totalRevenue,
    }
  }

  async getSales(startDate: Date, endDate: Date): Promise<MetricsResponse> {
    const sales = this.items.reduce((acc, order) => {
      if (
        order.createdAt.getTime() >= startDate.getTime() &&
        order.createdAt.getTime() <= endDate.getTime()
      ) {
        return acc + 1
      }

      return acc
    }, 0)

    return {
      value: sales,
    }
  }

  async getActiveClients(
    startDate: Date,
    endDate: Date,
  ): Promise<MetricsResponse> {
    const activeClients = this.items.reduce((acc, order) => {
      if (
        order.createdAt.getTime() >= startDate.getTime() &&
        order.createdAt.getTime() <= endDate.getTime()
      ) {
        return acc + 1
      }

      return acc
    }, 0)

    return {
      value: activeClients,
    }
  }

  async getRecentSales(
    startDate: Date,
    endDate: Date,
  ): Promise<RecentSalesResponse[]> {
    const recentSales = this.items.reduce((acc, order) => {
      if (
        order.createdAt.getTime() >= startDate.getTime() &&
        order.createdAt.getTime() <= endDate.getTime()
      ) {
        const client = this.clientsRepository.items.find((client) =>
          client.id.equals(order.clientId),
        )

        if (!client) {
          throw new Error('Client not found !')
        }

        const recentSale = {
          client: {
            id: client.id.toString(),
            name: client.name,
            email: client.email,
            image: client.image,
          },
          total: order.amountTotal,
        }

        return [...acc, recentSale]
      }

      return acc
    }, [] as RecentSalesResponse[])

    return recentSales
  }

  async findById(id: string) {
    const order = this.items.find((item) => item.id.toString() === id)

    if (!order) {
      return null
    }

    return order
  }

  async findByIdWithDetails(id: string): Promise<OrderWithDetails | null> {
    const order = this.items.find((item) => item.id.toString() === id)

    if (!order) {
      return null
    }

    const cart = await this.cartsRepository.findById(order.cartId.toString())

    if (!cart) {
      return null
    }

    const cartItems = await this.cartItemsRepository.findManyByCartId(
      cart.id.toString(),
    )

    const cartItemsWithDetails = await Promise.all(
      cartItems.map(async (cartItem) => {
        const dish = await this.dishRepository.findById(
          cartItem.dishId.toString(),
        )

        if (!dish) {
          throw new Error('Dish not found')
        }

        const ingredients =
          await this.dishIngredientsRepository.findManyByDishId(
            dish.id.toString(),
          )

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

          return attachment
        })

        return {
          id: dish.id.toString(),
          name: dish.name,
          description: dish.description,
          price: dish.price,
          slug: dish.slug.value,
          quantity: cartItem.quantity,
          ingredients: ingredients.map(
            (ingredient) => ingredient.ingredientName,
          ),
          attachments: attachments.map((attachment) => ({
            id: attachment.id.toString(),
            title: attachment.title,
            url: attachment.url,
          })),
        }
      }),
    )

    return OrderWithDetails.create({
      code: order.code,
      currency: order.currency,
      amountTotal: order.amountTotal,
      paymentMethod: order.paymentMethod,
      paymentStatus: order.paymentStatus,
      status: order.status,
      priority: order.priority,
      clientId: order.clientId,
      orderId: order.id,
      label: order.label,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
      cart: {
        createdAt: cart.createdAt,
        updatedAt: cart.updatedAt,
        totalAmount: cart.totalAmount,
        cartItems: cartItemsWithDetails,
      },
    })
  }

  async findAllWithDetails({ page }: PaginationParams): Promise<{
    orders: OrderWithDetails[]
    totalPages: number
  }> {
    const perPage = 10

    const totalOrders = this.items.length

    const paginatedOrders = this.items
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice((page - 1) * perPage, page * perPage)

    const totalPages = Math.ceil(totalOrders / perPage)

    const ordersWithDetails = await Promise.all(
      paginatedOrders.map(async (order) => {
        const cart = await this.cartsRepository.findById(
          order.cartId.toString(),
        )

        if (!cart) {
          throw new Error('Cart not found !')
        }

        const cartItems = await this.cartItemsRepository.findManyByCartId(
          cart.id.toString(),
        )

        const cartItemsWithDetails = await Promise.all(
          cartItems.map(async (cartItem) => {
            const dish = await this.dishRepository.findById(
              cartItem.dishId.toString(),
            )

            if (!dish) {
              throw new Error('Dish not found')
            }

            const ingredients =
              await this.dishIngredientsRepository.findManyByDishId(
                dish.id.toString(),
              )

            const dishAttachments =
              await this.dishAttachmentsRepository.findManyByDishId(
                dish.id.toString(),
              )

            const attachments = dishAttachments.map((dishAttachment) => {
              const attachment = this.attachmentsRepository.items.find(
                (attachment) =>
                  attachment.id.equals(dishAttachment.attachmentId),
              )

              if (!attachment) {
                throw new Error(
                  'A dish cannot be created without an dish attachment !',
                )
              }

              return attachment
            })

            return {
              id: dish.id.toString(),
              name: dish.name,
              description: dish.description,
              price: dish.price,
              slug: dish.slug.value,
              quantity: cartItem.quantity,
              ingredients: ingredients.map(
                (ingredient) => ingredient.ingredientName,
              ),
              attachments: attachments.map((attachment) => ({
                id: attachment.id.toString(),
                title: attachment.title,
                url: attachment.url,
              })),
            }
          }),
        )

        return OrderWithDetails.create({
          code: order.code,
          currency: order.currency,
          amountTotal: order.amountTotal,
          paymentMethod: order.paymentMethod,
          paymentStatus: order.paymentStatus,
          status: order.status,
          priority: order.priority,
          clientId: order.clientId,
          orderId: order.id,
          label: order.label,
          createdAt: order.createdAt,
          updatedAt: order.updatedAt,
          cart: {
            createdAt: cart.createdAt,
            updatedAt: cart.updatedAt,
            totalAmount: cart.totalAmount,
            cartItems: cartItemsWithDetails,
          },
        })
      }),
    )

    return {
      orders: ordersWithDetails,
      totalPages,
    }
  }

  async findManyByClientIdWithDetails(
    clientId: string,
    params: PaginationParams,
  ): Promise<{ orders: OrderWithDetails[]; totalPages: number }> {
    const perPage = 10

    const orders = this.items.filter(
      (item) => item.clientId.toString() === clientId,
    )

    const totalOrders = orders.length

    const paginatedOrders = orders
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice((params.page - 1) * perPage, params.page * perPage)

    const totalPages = Math.ceil(totalOrders / perPage)

    const ordersWithDetails = await Promise.all(
      paginatedOrders.map(async (order) => {
        const cart = await this.cartsRepository.findById(
          order.cartId.toString(),
        )

        if (!cart) {
          throw new Error('Cart not found !')
        }

        const cartItems = await this.cartItemsRepository.findManyByCartId(
          cart.id.toString(),
        )

        const cartItemsWithDetails = await Promise.all(
          cartItems.map(async (cartItem) => {
            const dish = await this.dishRepository.findById(
              cartItem.dishId.toString(),
            )

            if (!dish) {
              throw new Error('Dish not found')
            }

            const ingredients =
              await this.dishIngredientsRepository.findManyByDishId(
                dish.id.toString(),
              )

            const dishAttachments =
              await this.dishAttachmentsRepository.findManyByDishId(
                dish.id.toString(),
              )

            const attachments = dishAttachments.map((dishAttachment) => {
              const attachment = this.attachmentsRepository.items.find(
                (attachment) =>
                  attachment.id.equals(dishAttachment.attachmentId),
              )

              if (!attachment) {
                throw new Error(
                  'A dish cannot be created without an dish attachment !',
                )
              }

              return attachment
            })

            return {
              id: dish.id.toString(),
              name: dish.name,
              description: dish.description,
              price: dish.price,
              slug: dish.slug.value,
              quantity: cartItem.quantity,
              ingredients: ingredients.map(
                (ingredient) => ingredient.ingredientName,
              ),
              attachments: attachments.map((attachment) => ({
                id: attachment.id.toString(),
                title: attachment.title,
                url: attachment.url,
              })),
            }
          }),
        )

        return OrderWithDetails.create({
          code: order.code,
          currency: order.currency,
          amountTotal: order.amountTotal,
          paymentMethod: order.paymentMethod,
          paymentStatus: order.paymentStatus,
          status: order.status,
          priority: order.priority,
          clientId: order.clientId,
          orderId: order.id,
          label: order.label,
          createdAt: order.createdAt,
          updatedAt: order.updatedAt,
          cart: {
            createdAt: cart.createdAt,
            updatedAt: cart.updatedAt,
            totalAmount: cart.totalAmount,
            cartItems: cartItemsWithDetails,
          },
        })
      }),
    )

    return {
      orders: ordersWithDetails,
      totalPages,
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
