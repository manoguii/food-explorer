import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'
import { CartItemList } from './cart-item-list'
import { AggregateRoot } from '@/core/entities/aggregate-root'

export interface CartProps {
  clientId: UniqueEntityID
  totalAmount: number
  items: CartItemList
  createdAt: Date
  updatedAt?: Date | null
}

export class Cart extends AggregateRoot<CartProps> {
  get clientId() {
    return this.props.clientId
  }

  get totalAmount() {
    return this.props.totalAmount
  }

  set totalAmount(totalAmount: number) {
    this.props.totalAmount = totalAmount
    this.touch()
  }

  get items() {
    return this.props.items
  }

  set items(items: CartItemList) {
    this.props.items = items
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
    props: Optional<CartProps, 'createdAt' | 'items' | 'totalAmount'>,
    id?: UniqueEntityID,
  ) {
    const cart = new Cart(
      {
        ...props,
        items: props.items ?? new CartItemList(),
        createdAt: props.createdAt ?? new Date(),
        totalAmount: props.totalAmount ?? 0,
      },
      id,
    )

    return cart
  }
}
