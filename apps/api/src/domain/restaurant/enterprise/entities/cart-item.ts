import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

export interface CartItemProps {
  cartId: UniqueEntityID
  dishId: UniqueEntityID
  dishPrice: number
  quantity: number
  cost: number

  updatedAt?: Date | null
}

export class CartItem extends Entity<CartItemProps> {
  get cartId() {
    return this.props.cartId
  }

  get dishId() {
    return this.props.dishId
  }

  get dishPrice() {
    return this.props.dishPrice
  }

  get quantity() {
    return this.props.quantity
  }

  set quantity(quantity: number) {
    this.props.quantity = quantity
    this.touch()
  }

  get cost() {
    return this.props.cost
  }

  set cost(cost: number) {
    this.props.cost = cost
    this.touch()
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  private touch() {
    this.props.updatedAt = new Date()
  }

  static create(props: CartItemProps, id?: UniqueEntityID) {
    const cartItem = new CartItem(
      {
        ...props,
      },
      id,
    )

    return cartItem
  }
}
