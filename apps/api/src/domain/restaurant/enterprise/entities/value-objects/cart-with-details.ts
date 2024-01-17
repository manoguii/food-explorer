import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ValueObject } from '@/core/entities/value-object'

export interface CartWithDetailsProps {
  cartId: UniqueEntityID
  totalAmount: number

  createdAt: Date
  updatedAt?: Date | null

  dishes: {
    id: string
    name: string
    description: string
    price: number
    slug: string
    quantity: number
    updatedAt?: Date | null
    attachments: {
      id: string
      title: string
      url: string
    }[]
  }[]

  client: {
    id: string
    name: string
    email: string
  }
}

export class CartWithDetails extends ValueObject<CartWithDetailsProps> {
  get cartId() {
    return this.props.cartId
  }

  get totalAmount() {
    return this.props.totalAmount
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

  public static create(props: CartWithDetailsProps) {
    return new CartWithDetails(props)
  }
}
