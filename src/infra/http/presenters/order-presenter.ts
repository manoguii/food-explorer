import { Order } from '@/domain/restaurant/enterprise/entities/order'

export class OrderPresenter {
  static toHTTP(order: Order) {
    return {
      id: order.id.toString(),
      clientId: order.clientId.toString(),
      code: order.code.value,
      status: order.status,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    }
  }
}
