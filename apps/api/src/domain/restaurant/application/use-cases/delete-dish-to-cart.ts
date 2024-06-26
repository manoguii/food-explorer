import { Injectable } from '@nestjs/common'

import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { Cart } from '@/domain/restaurant/enterprise/entities/cart'

import { CartItemList } from '../../enterprise/entities/cart-item-list'
import { CartItemsRepository } from '../repositories/cart-item-repository'
import { CartRepository } from '../repositories/cart-repository'

interface DeleteDishToCartUseCaseRequest {
  cartId: string
  dishId: string
}

type DeleteDishToCartUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    cart: Cart
  }
>

@Injectable()
export class DeleteDishToCartUseCase {
  constructor(
    private cartRepository: CartRepository,
    private cartItemsRepository: CartItemsRepository,
  ) {}

  async execute({
    cartId,
    dishId,
  }: DeleteDishToCartUseCaseRequest): Promise<DeleteDishToCartUseCaseResponse> {
    const cart = await this.cartRepository.findById(cartId)

    if (!cart) {
      return left(new ResourceNotFoundError())
    }

    const currentCartItems =
      await this.cartItemsRepository.findManyByCartId(cartId)

    const cartItemList = new CartItemList(currentCartItems)

    const cartItem = currentCartItems.find(
      (cartItem) => cartItem.dishId.toString() === dishId,
    )

    if (!cartItem) {
      return left(new ResourceNotFoundError())
    }

    cartItemList.remove(cartItem)

    const totalAmount = cartItemList.currentItems.reduce(
      (acc, cartItem) => acc + cartItem.cost,
      0,
    )

    cart.items = cartItemList
    cart.totalAmount = totalAmount

    await this.cartRepository.save(cart)

    return right({
      cart,
    })
  }
}
