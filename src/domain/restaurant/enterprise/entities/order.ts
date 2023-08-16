import { Entity } from '@/core/entities/entity'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'
import { Price } from './value-objects/price'
import { Dish } from './dish'
import { randomUUID } from 'crypto'

export interface OrderProps {
  userId: string
  dishes: Dish[]
  total: Price
  code: string

  orderStatus: 'pending' | 'delivered' | 'preparing'

  paymentMethod: 'credit' | 'pix'
  paymentStatus: 'pending' | 'paid' | 'recused'

  createdAt: Date
  deliveredIn?: Date
  updatedAt?: Date
}

export class Order extends Entity<OrderProps> {
  get userId() {
    return this.props.userId
  }

  get dishes() {
    return this.props.dishes
  }

  get code() {
    return this.props.code
  }

  get total() {
    return this.props.total
  }

  get orderStatus() {
    return this.props.orderStatus
  }

  set orderStatus(status: 'pending' | 'delivered' | 'preparing') {
    if (status === 'delivered') {
      this.finishOrder()
    } else {
      this.props.orderStatus = status
      this.touch()
    }
  }

  get paymentMethod() {
    return this.props.paymentMethod
  }

  get paymentStatus() {
    return this.props.paymentStatus
  }

  get createdAt() {
    return this.props.createdAt
  }

  get deliveredIn() {
    return this.props.deliveredIn
  }

  set deliveredIn(date: Date | undefined) {
    this.props.deliveredIn = date
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  private finishOrder() {
    if (this.props.paymentStatus === 'paid') {
      this.props.orderStatus = 'delivered'
      this.props.deliveredIn = new Date()
      this.touch()
    } else {
      throw new Error('Payment order not received !')
    }
  }

  private touch() {
    this.props.updatedAt = new Date()
  }

  static create(
    props: Optional<
      OrderProps,
      'createdAt' | 'paymentStatus' | 'orderStatus' | 'code'
    >,
    id?: UniqueEntityId,
  ) {
    const order = new Order(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
        code: props.code ?? randomUUID(),
        orderStatus: props.orderStatus ?? 'pending',
        paymentStatus: props.paymentStatus ?? 'pending',
      },
      id,
    )

    return order
  }
}
