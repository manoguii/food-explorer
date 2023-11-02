import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'
import { OrderStatus } from './order'

export interface OrderItemProps {
  orderId: UniqueEntityID
  dishId: UniqueEntityID
  quantity: number
  status: OrderStatus
  updatedAt?: Date | null
}

export class OrderItem extends Entity<OrderItemProps> {
  get orderId() {
    return this.props.orderId
  }

  get dishId() {
    return this.props.dishId
  }

  get quantity() {
    return this.props.quantity
  }

  get status() {
    return this.props.status
  }

  set status(status: OrderStatus) {
    this.props.status = status
    this.touch()
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  isDelivered() {
    return this.props.status === 'DELIVERED'
  }

  isCanceled() {
    return this.props.status === 'CANCELED'
  }

  private touch() {
    this.props.updatedAt = new Date()
  }

  static create(
    props: Optional<OrderItemProps, 'status'>,
    id?: UniqueEntityID,
  ) {
    const orderItem = new OrderItem(
      {
        ...props,
        status: props.status ?? 'PENDING',
      },
      id,
    )

    return orderItem
  }
}
