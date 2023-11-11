import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'
import { Code } from './value-objects/code'
import { OrderItemList } from './order-item-list'
import { AggregateRoot } from '@/core/entities/aggregate-root'

export type OrderStatus = 'PENDING' | 'PREPARING' | 'DELIVERED' | 'CANCELED'
export type Label = 'TABLE' | 'DELIVERY' | 'TAKEOUT'
export type Priority = 'LOW' | 'MEDIUM' | 'HIGH'

export interface OrderProps {
  clientId: UniqueEntityID
  items: OrderItemList
  code: Code
  status: OrderStatus
  orderDetails: string
  label: Label
  priority: Priority
  createdAt: Date
  updatedAt?: Date | null
}

export class Order extends AggregateRoot<OrderProps> {
  get clientId() {
    return this.props.clientId
  }

  get code() {
    return this.props.code
  }

  get items() {
    return this.props.items
  }

  set items(items: OrderItemList) {
    this.props.items = items
    this.touch()
  }

  get orderDetails() {
    return this.props.orderDetails
  }

  set orderDetails(orderDetails: string) {
    this.props.orderDetails = orderDetails
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

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  get status() {
    return this.props.status
  }

  updateStatusBasedOnItems() {
    const allItemsDelivered = this.props.items.allItemsDelivered()
    const allItemsCanceled = this.props.items.allItemsCanceled()

    if (allItemsCanceled) {
      this.props.status = 'CANCELED'
    } else if (allItemsDelivered) {
      this.props.status = 'DELIVERED'
    } else {
      this.props.status = 'PREPARING'
    }

    this.touch()
  }

  private touch() {
    this.props.updatedAt = new Date()
  }

  static create(
    props: Optional<
      OrderProps,
      'createdAt' | 'status' | 'code' | 'items' | 'priority' | 'label'
    >,
    id?: UniqueEntityID,
  ) {
    const order = new Order(
      {
        ...props,
        status: props.status ?? 'PENDING',
        label: props.label ?? 'TABLE',
        priority: props.priority ?? 'LOW',
        code: props.code ?? Code.generateUniqueCode(),
        items: props.items ?? new OrderItemList(),
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    )

    return order
  }
}
