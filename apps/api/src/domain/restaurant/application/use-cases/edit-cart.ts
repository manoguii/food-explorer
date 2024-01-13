import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'

import { Injectable } from '@nestjs/common'
import { Cart } from '../../enterprise/entities/cart'
import { CartRepository } from '../repositories/cart-repository'
import { CartItemsRepository } from '../repositories/cart-item-repository'
import { CartItemList } from '../../enterprise/entities/cart-item-list'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { CartItem } from '../../enterprise/entities/cart-item'
import { DishRepository } from '../repositories/dish-repository'

interface EditCartUseCaseRequest {
  cartId: string
  dishes: {
    dishId: string
    quantity: number
  }[]
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
    dishes,
  }: EditCartUseCaseRequest): Promise<EditCartUseCaseResponse> {
    const cart = await this.cartRepository.findById(cartId)

    if (!cart) {
      return left(new ResourceNotFoundError())
    }

    const allDishes = await this.dishRepository.findManyByIds(
      dishes.map((dish) => dish.dishId),
    )

    const currentCartItems = await this.cartItemsRepository.findManyByCartId(
      cart.id.toString(),
    )

    const cartItemList = new CartItemList(currentCartItems)

    const cartItems = dishes.map((dish) => {
      const dishEntity = allDishes.find(
        (dishEntity) => dishEntity.id.toString() === dish.dishId,
      )

      if (!dishEntity) {
        throw new Error('Dish not found')
      }

      return CartItem.create({
        dishId: new UniqueEntityID(dish.dishId),
        cartId: new UniqueEntityID(cartId),
        quantity: dish.quantity,
        cost: dish.quantity * dishEntity.price,
        dishPrice: dishEntity.price,
      })
    })

    cartItemList.update(cartItems)

    cart.items = cartItemList
    cart.totalAmount = cartItems.reduce((acc, item) => {
      return acc + item.cost
    }, 0)

    await this.cartRepository.save(cart)

    return right({
      cart,
    })
  }
}
