import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ValueObject } from '@/core/entities/value-object'
import { Label, OrderStatus, PaymentStatus, Priority } from '../order'

interface OrderWithDetailsProps {
  orderId: UniqueEntityID
  clientId: UniqueEntityID
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

  cart: {
    totalAmount: number
    createdAt: Date
    updatedAt?: Date | null
    cartItems: {
      id: string
      name: string
      description: string
      price: number
      slug: string
      quantity: number
      ingredients: string[]
      attachments: {
        id: string
        title: string
        url: string
      }[]
    }[]
  }
}

export class OrderWithDetails extends ValueObject<OrderWithDetailsProps> {
  get orderId() {
    return this.props.orderId
  }

  get clientId() {
    return this.props.clientId
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

  get status() {
    return this.props.status
  }

  get priority() {
    return this.props.priority
  }

  get label() {
    return this.props.label
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  get cart() {
    return this.props.cart
  }

  public static create(props: OrderWithDetailsProps) {
    return new OrderWithDetails(props)
  }
}
