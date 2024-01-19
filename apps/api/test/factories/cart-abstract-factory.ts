import { InMemoryDishRepository } from 'test/repositories/in-memory-dish-repository'
import { Cart } from '@/domain/restaurant/enterprise/entities/cart'
import { InMemoryCartRepository } from 'test/repositories/in-memory-cart-repository'
import { InMemoryCartItemsRepository } from 'test/repositories/in-memory-cart-item-repository'
import { makeCart } from './make-cart'
import { makeCartItem } from './make-cart-item'
import { makeDish } from './make-dish'
import { CartItem } from '@/domain/restaurant/enterprise/entities/cart-item'
import { Client } from '@/domain/restaurant/enterprise/entities/client'
import { InMemoryClientsRepository } from 'test/repositories/in-memory-clients-repository'
import { makeClient } from './make-client'

interface AbstractFactory {
  createClient(): Client
  createCart(): {
    cart: Cart
    client: Client
  }
  createCartWithItems(): {
    cart: Cart
    client: Client
    cartItems: CartItem[]
  }
}

export class CartAbstractFactory implements AbstractFactory {
  constructor(
    private cartRepository: InMemoryCartRepository,
    private cartItemsRepository: InMemoryCartItemsRepository,
    private dishRepository: InMemoryDishRepository,
    private clientsRepository: InMemoryClientsRepository,
  ) {}

  createClient(): Client {
    const client = makeClient()
    this.clientsRepository.items.push(client)

    return client
  }

  createCart(): {
    cart: Cart
    client: Client
  } {
    const client = this.createClient()

    const cart = makeCart({
      clientId: client.id,
    })
    this.cartRepository.items.push(cart)

    return { cart, client }
  }

  createCartWithItems(): {
    cart: Cart
    client: Client
    cartItems: CartItem[]
  } {
    const client = this.createClient()

    const dish = makeDish()
    const dish2 = makeDish()

    this.dishRepository.items.push(dish, dish2)

    const cart = makeCart({
      clientId: client.id,
    })

    this.cartRepository.items.push(cart)

    const cartItem = makeCartItem({ dishId: dish.id, cartId: cart.id })
    const cartItem2 = makeCartItem({ dishId: dish2.id, cartId: cart.id })

    this.cartItemsRepository.items.push(cartItem, cartItem2)

    return { cart, client, cartItems: [cartItem, cartItem2] }
  }
}
