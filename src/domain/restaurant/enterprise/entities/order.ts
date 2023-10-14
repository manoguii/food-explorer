import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'
import { Entity } from '@/core/entities/entity'
import { Dish } from './dish'
import { Code } from './value-objects/code'

type Status = 'PENDING' | 'PREPARING' | 'DELIVERED' | 'CANCELED'

export interface OrderProps {
  code: Code
  status: Status
  items: Dish[]
  createdAt: Date
  updatedAt?: Date
}

export class Order extends Entity<OrderProps> {
  get code() {
    return this.props.code
  }

  get status() {
    return this.props.status
  }

  set status(status: Status) {
    this.props.status = status
    this.touch()
  }

  get items() {
    return this.props.items
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

  static create(props: Optional<OrderProps, 'createdAt'>, id?: UniqueEntityID) {
    const order = new Order(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    )

    return order
  }
}
