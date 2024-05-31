import { Injectable } from '@nestjs/common'

import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'

import { Cart } from '../../enterprise/entities/cart'
import { CartItemsRepository } from '../repositories/cart-item-repository'
import { CartRepository } from '../repositories/cart-repository'
import { DishRepository } from '../repositories/dish-repository'

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
    private dishRepository: DishRepository,
  ) {}

  async execute({
    cartId,
    dish,
  }: EditCartUseCaseRequest): Promise<EditCartUseCaseResponse> {
    const cart = await this.cartRepository.findById(cartId)

    if (!cart) {
      return left(new ResourceNotFoundError())
    }

    const dishOnDb = await this.dishRepository.findById(dish.dishId)

    if (!dishOnDb) {
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
    cartItem.cost = dish.quantity * dishOnDb.price

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
