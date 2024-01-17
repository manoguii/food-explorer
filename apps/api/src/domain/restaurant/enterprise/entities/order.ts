import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'
import { randomUUID } from 'node:crypto'
import { Entity } from '@/core/entities/entity'

export type OrderStatus = 'PENDING' | 'PREPARING' | 'DELIVERED' | 'CANCELED'
export type Label = 'TABLE' | 'DELIVERY' | 'TAKEOUT'
export type Priority = 'LOW' | 'MEDIUM' | 'HIGH'
export type PaymentStatus = 'PAID' | 'UNPAID'

export interface OrderProps {
  clientId: UniqueEntityID
  cartId: UniqueEntityID
  sessionId: UniqueEntityID

  code: string
  currency: string
  amountTotal: number
  paymentMethod: string
  paymentStatus: PaymentStatus
  status: OrderStatus
  priority: Priority
  label: Label
  createdAt: Date
  updatedAt?: Date | null
}

export class Order extends Entity<OrderProps> {
  get clientId() {
    return this.props.clientId
  }

  get cartId() {
    return this.props.cartId
  }

  get sessionId() {
    return this.props.sessionId
  }

  get code() {
    return this.props.code
  }

  get currency() {
    return this.props.currency
  }

  get amountTotal() {
    return this.props.amountTotal
  }

  get paymentMethod() {
    return this.props.paymentMethod
  }

  get paymentStatus() {
    return this.props.paymentStatus
  }

  set paymentStatus(paymentStatus: PaymentStatus) {
    this.props.paymentStatus = paymentStatus
    this.touch()
  }

  get label() {
    return this.props.label
  }

  set label(label: Label) {
    this.props.label = label
    this.touch()
  }

  get priority() {
    return this.props.priority
  }

  set priority(priority: Priority) {
    this.props.priority = priority
    this.touch()
  }

  get status() {
    return this.props.status
  }

  set status(status: OrderStatus) {
    this.props.status = status
    this.touch()
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  private touch() {
    this.props.updatedAt = new Date()
  }

  static create(
    props: Optional<
      OrderProps,
      'createdAt' | 'code' | 'label' | 'status' | 'priority'
    >,
    id?: UniqueEntityID,
  ) {
    const order = new Order(
      {
        ...props,
        code: props.code ?? randomUUID(),
        label: props.label ?? 'TABLE',
        status: props.status ?? 'PENDING',
        priority: props.priority ?? 'LOW',
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    )

    return order
  }
}
