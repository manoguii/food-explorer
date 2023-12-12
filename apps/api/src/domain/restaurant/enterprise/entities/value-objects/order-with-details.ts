import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ValueObject } from '@/core/entities/value-object'
import { Label, OrderStatus, Priority } from '../order'

interface OrderWithDetailsProps {
  orderId: UniqueEntityID
  code: string
  status: OrderStatus
  label: Label
  priority: Priority
  createdAt: Date
  updatedAt?: Date | null

  dishes: {
    id: string
    name: string
    description: string
    price: number
    slug: string
    attachments: {
      id: string
      title: string
      url: string
    }[]

    quantity: number
    status: OrderStatus
    updatedAt?: Date | null
  }[]

  client: {
    id: string
    name: string
    email: string
  }
}

export class OrderWithDetails extends ValueObject<OrderWithDetailsProps> {
  get orderId() {
    return this.props.orderId
  }

  get code() {
    return this.props.code
  }

  get status() {
    return this.props.status
  }

  get label() {
    return this.props.label
  }

  get priority() {
    return this.props.priority
  }

  get dishes() {
    return this.props.dishes
  }

  get client() {
    return this.props.client
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  public static create(props: OrderWithDetailsProps) {
    return new OrderWithDetails(props)
  }
}
