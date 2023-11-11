import { Order } from '@/domain/restaurant/enterprise/entities/order'

export class OrderPresenter {
  static toHTTP(order: Order) {
    return {
      id: order.id.toString(),
      details: order.orderDetails,
      code: order.code.value,
      status: order.status,
      label: order.label,
      priority: order.priority,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    }
  }
}
