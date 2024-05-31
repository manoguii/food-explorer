import { Injectable } from '@nestjs/common'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { PaginationParams } from '@/core/repositories/pagination-params'
import {
  MetricsResponse,
  OrdersRepository,
  RecentSalesResponse,
} from '@/domain/restaurant/application/repositories/orders-repository'
import { Order } from '@/domain/restaurant/enterprise/entities/order'
import { OrderWithDetails } from '@/domain/restaurant/enterprise/entities/value-objects/order-with-details'

import { PrismaOrderMapper } from '../mappers/prisma-order-mapper'
import { PrismaService } from '../prisma.service'

@Injectable()
export class PrismaOrdersRepository implements OrdersRepository {
  constructor(private prisma: PrismaService) {}

  async getOverview(): Promise<{ name: string; total: number }[]> {
    const orders = await this.prisma.order.findMany({
      select: {
        createdAt: true,
        amountTotal: true,
      },
    })

    const data = months.map((month) => ({ name: month, total: 0 }))

    orders.forEach((order) => {
      const monthIndex = new Date(order.createdAt).getMonth()
      data[monthIndex].total += order.amountTotal
    })

    return data
  }

  async getTotalRevenue(
    startDate: Date,
    endDate: Date,
  ): Promise<MetricsResponse> {
    const totalRevenue = await this.prisma.order.aggregate({
      _sum: {
        amountTotal: true,
      },
      where: {
        createdAt: {
          gte: startDate,
          lt: endDate,
        },
      },
    })

    const totalRevenueAmount = totalRevenue._sum.amountTotal || 0

    return {
      value: totalRevenueAmount,
    }
  }

  async getSales(startDate: Date, endDate: Date): Promise<MetricsResponse> {
    const sales = await this.prisma.order.count({
      where: {
        createdAt: {
          gte: startDate,
          lt: endDate,
        },
      },
    })

    return {
      value: sales,
    }
  }

  async getActiveClients(
    startDate: Date,
    endDate: Date,
  ): Promise<MetricsResponse> {
    const activeClients = await this.prisma.order.groupBy({
      by: ['userId'],
      where: {
        createdAt: {
          gte: startDate,
          lt: endDate,
        },
      },
    })

    return {
      value: activeClients.length,
    }
  }

  async getRecentSales(
    startDate: Date,
    endDate: Date,
  ): Promise<RecentSalesResponse[]> {
    const orders = await this.prisma.order.findMany({
      where: {
        createdAt: {
          gte: startDate,
          lt: endDate,
        },
      },
      include: {
        user: true,
      },
    })

    return orders.map((order) => ({
      total: order.amountTotal,
      client: {
        id: order.user.id,
        name: order.user.name,
        email: order.user.email,
        image: order.user.image,
      },
    }))
  }

  async findById(id: string): Promise<Order | null> {
    const order = await this.prisma.order.findUnique({
      where: {
        id,
      },
    })

    if (!order) {
      return null
    }

    return PrismaOrderMapper.toDomain(order)
  }

  async findManyByClientIdWithDetails(
    clientId: string,
    params: PaginationParams,
  ): Promise<{ orders: OrderWithDetails[]; totalPages: number }> {
    const perPage = 10
    const { page } = params

    const orders = await this.prisma.order.findMany({
      where: {
        userId: clientId,
      },
      include: {
        cart: {
          include: {
            cartItems: {
              include: {
                dish: {
                  include: {
                    attachments: true,
                    ingredients: true,
                  },
                },
              },
            },
          },
        },
        user: true,
      },
      skip: (page - 1) * perPage,
      take: perPage,
    })

    const totalOrders = await this.prisma.order.count({
      where: {
        userId: clientId,
      },
    })

    const totalPages = Math.ceil(totalOrders / perPage)

    return {
      orders: orders.map((order) =>
        OrderWithDetails.create({
          orderId: new UniqueEntityID(order.id),
          clientId: new UniqueEntityID(order.user.id),
          code: order.code,
          status: order.status,
          amountTotal: order.amountTotal,
          currency: order.currency,
          paymentMethod: order.paymentMethod,
          paymentStatus: order.paymentStatus,
          priority: order.priority,
          label: order.label,
          createdAt: order.createdAt,
          updatedAt: order.updatedAt,
          cart: {
            createdAt: order.cart.createdAt,
            updatedAt: order.cart.updatedAt,
            totalAmount: order.cart.totalAmount,
            cartItems: order.cart.cartItems.map((cartItem) => ({
              id: cartItem.dish.id,
              name: cartItem.dish.name,
              description: cartItem.dish.description,
              price: cartItem.dish.price,
              slug: cartItem.dish.slug,
              quantity: cartItem.quantity,
              ingredients: cartItem.dish.ingredients.map(
                (ingredient) => ingredient.name,
              ),
              attachments: cartItem.dish.attachments.map((attachment) => ({
                id: attachment.id,
                title: attachment.title,
                url: attachment.url,
              })),
            })),
          },
        }),
      ),
      totalPages,
    }
  }

  async findByIdWithDetails(id: string): Promise<OrderWithDetails | null> {
    const order = await this.prisma.order.findUnique({
      where: {
        id,
      },
      include: {
        cart: {
          include: {
            cartItems: {
              include: {
                dish: {
                  include: {
                    attachments: true,
                    ingredients: true,
                  },
                },
              },
            },
          },
        },
        user: true,
      },
    })

    if (!order) {
      return null
    }

    return OrderWithDetails.create({
      orderId: new UniqueEntityID(order.id),
      clientId: new UniqueEntityID(order.user.id),
      code: order.code,
      status: order.status,
      amountTotal: order.amountTotal,
      currency: order.currency,
      paymentMethod: order.paymentMethod,
      paymentStatus: order.paymentStatus,
      priority: order.priority,
      label: order.label,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
      cart: {
        createdAt: order.cart.createdAt,
        updatedAt: order.cart.updatedAt,
        totalAmount: order.cart.totalAmount,
        cartItems: order.cart.cartItems.map((cartItem) => ({
          id: cartItem.dish.id,
          name: cartItem.dish.name,
          description: cartItem.dish.description,
          price: cartItem.dish.price,
          slug: cartItem.dish.slug,
          quantity: cartItem.quantity,
          ingredients: cartItem.dish.ingredients.map(
            (ingredient) => ingredient.name,
          ),
          attachments: cartItem.dish.attachments.map((attachment) => ({
            id: attachment.id,
            title: attachment.title,
            url: attachment.url,
          })),
        })),
      },
    })
  }

  async findAllWithDetails(
    params: PaginationParams,
  ): Promise<{ orders: OrderWithDetails[]; totalPages: number }> {
    const perPage = 10
    const { page } = params

    const orders = await this.prisma.order.findMany({
      include: {
        cart: {
          include: {
            cartItems: {
              include: {
                dish: {
                  include: {
                    attachments: true,
                    ingredients: true,
                  },
                },
              },
            },
          },
        },
        user: true,
      },
      skip: (page - 1) * perPage,
      take: perPage,
    })

    const totalOrders = await this.prisma.order.count()

    const totalPages = Math.ceil(totalOrders / perPage)

    return {
      orders: orders.map((order) =>
        OrderWithDetails.create({
          orderId: new UniqueEntityID(order.id),
          clientId: new UniqueEntityID(order.user.id),
          code: order.code,
          status: order.status,
          amountTotal: order.amountTotal,
          currency: order.currency,
          paymentMethod: order.paymentMethod,
          paymentStatus: order.paymentStatus,
          priority: order.priority,
          label: order.label,
          createdAt: order.createdAt,
          updatedAt: order.updatedAt,
          cart: {
            createdAt: order.cart.createdAt,
            updatedAt: order.cart.updatedAt,
            totalAmount: order.cart.totalAmount,
            cartItems: order.cart.cartItems.map((cartItem) => ({
              id: cartItem.dish.id,
              name: cartItem.dish.name,
              description: cartItem.dish.description,
              price: cartItem.dish.price,
              slug: cartItem.dish.slug,
              quantity: cartItem.quantity,
              ingredients: cartItem.dish.ingredients.map(
                (ingredient) => ingredient.name,
              ),
              attachments: cartItem.dish.attachments.map((attachment) => ({
                id: attachment.id,
                title: attachment.title,
                url: attachment.url,
              })),
            })),
          },
        }),
      ),
      totalPages,
    }
  }

  async create(order: Order): Promise<void> {
    const data = PrismaOrderMapper.toPrisma(order)

    await this.prisma.order.create({
      data,
    })
  }

  async save(order: Order): Promise<void> {
    const data = PrismaOrderMapper.toPrisma(order)

    await Promise.all([
      this.prisma.order.update({
        where: {
          id: order.id.toString(),
        },
        data,
      }),
    ])
  }
}

const months = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
]
