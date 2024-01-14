import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { Cart } from '@/domain/restaurant/enterprise/entities/cart'
import { CartRepository } from '../repositories/cart-repository'
import { CartItemsRepository } from '../repositories/cart-item-repository'
import { Injectable } from '@nestjs/common'
import { DishRepository } from '../repositories/dish-repository'
import { CartItem } from '../../enterprise/entities/cart-item'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { CartItemList } from '../../enterprise/entities/cart-item-list'

interface AddDishToCartUseCaseRequest {
  cartId: string
  dishId: string
  quantity: number
}

type AddDishToCartUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    cart: Cart
  }
>

@Injectable()
export class AddDishToCartUseCase {
  constructor(
    private cartRepository: CartRepository,
    private cartItemsRepository: CartItemsRepository,
    private dishRepository: DishRepository,
  ) {}

  async execute({
    cartId,
    dishId,
    quantity,
  }: AddDishToCartUseCaseRequest): Promise<AddDishToCartUseCaseResponse> {
    const cart = await this.cartRepository.findById(cartId)

    if (!cart) {
      return left(new ResourceNotFoundError())
    }

    const dish = await this.dishRepository.findById(dishId)

    if (!dish) {
      return left(new ResourceNotFoundError())
    }

    const currentCartItems = await this.cartItemsRepository.findManyByCartId(
      cart.id.toString(),
    )

    const cartItemList = new CartItemList(currentCartItems)

    const cartItem = currentCartItems.find(
      (cartItem) => cartItem.dishId.toString() === dishId,
    )

    if (!cartItem) {
      const newCartItem = CartItem.create({
        dishId: new UniqueEntityID(dishId),
        cartId: new UniqueEntityID(cartId),
        cost: dish.price * quantity,
        dishPrice: dish.price,
        quantity,
      })

      cartItemList.add(newCartItem)
    } else {
      cartItem.quantity += quantity
      cartItem.cost = cartItem.quantity * cartItem.dishPrice
    }

    const totalAmount = cartItemList.currentItems.reduce((acc, item) => {
      return acc + item.cost
    }, 0)

    cart.items = cartItemList
    cart.totalAmount = totalAmount

    await this.cartRepository.save(cart)

    return right({
      cart,
    })
  }
}
