import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'

import { Injectable } from '@nestjs/common'
import { Cart } from '../../enterprise/entities/cart'
import { CartRepository } from '../repositories/cart-repository'
import { CartItemsRepository } from '../repositories/cart-item-repository'

interface EditCartUseCaseRequest {
  cartId: string
  dish: {
    dishId: string
    quantity: number
  }
}

type EditCartUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    cart: Cart
  }
>

@Injectable()
export class EditCartUseCase {
  constructor(
    private cartRepository: CartRepository,
    private cartItemsRepository: CartItemsRepository,
  ) {}

  async execute({
    cartId,
    dish,
  }: EditCartUseCaseRequest): Promise<EditCartUseCaseResponse> {
    const cart = await this.cartRepository.findById(cartId)

    if (!cart) {
      return left(new ResourceNotFoundError())
    }

    const currentCartItems = await this.cartItemsRepository.findManyByCartId(
      cart.id.toString(),
    )

    const cartItem = currentCartItems.find(
      (cartItem) => cartItem.dishId.toString() === dish.dishId,
    )

    if (!cartItem) {
      return left(new ResourceNotFoundError())
    }

    cartItem.quantity = dish.quantity
    cartItem.cost = dish.quantity * cartItem.dishPrice

    await this.cartItemsRepository.save(cartItem)

    cart.totalAmount = currentCartItems.reduce(
      (acc, cartItem) => acc + cartItem.cost,
      0,
    )

    await this.cartRepository.save(cart)

    return right({
      cart,
    })
  }
}
