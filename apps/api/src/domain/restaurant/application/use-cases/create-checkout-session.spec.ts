import { InMemoryCartRepository } from 'test/repositories/in-memory-cart-repository'
import { makeCart } from 'test/factories/make-cart'

import { InMemoryCartItemsRepository } from 'test/repositories/in-memory-cart-item-repository'
import { InMemoryDishRepository } from 'test/repositories/in-memory-dish-repository'
import { InMemoryDishAttachmentsRepository } from 'test/repositories/in-memory-dish-attachments-repository'
import { InMemoryAttachmentsRepository } from 'test/repositories/in-memory-attachments-repository'
import { InMemoryCategoryRepository } from 'test/repositories/in-memory-category-repository'
import { InMemoryDishIngredientsRepository } from 'test/repositories/in-memory-dish-ingredients-repository'
import { InMemoryClientsRepository } from 'test/repositories/in-memory-clients-repository'
import { makeDish } from 'test/factories/make-dish'
import { makeCartItem } from 'test/factories/make-cart-item'
import { CreateCheckoutSessionUseCase } from './create-checkout-session'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { makeClient } from 'test/factories/make-client'
import { InMemoryPaymentStripeRepository } from 'test/payment/in-memory-payment-stripe-repository'

let inMemoryClientsRepository: InMemoryClientsRepository
let inMemoryDishIngredientsRepository: InMemoryDishIngredientsRepository
let inMemoryCategoryRepository: InMemoryCategoryRepository
let inMemoryDishRepository: InMemoryDishRepository
let inMemoryDishAttachmentsRepository: InMemoryDishAttachmentsRepository
let inMemoryAttachmentsRepository: InMemoryAttachmentsRepository

let inMemoryCartRepository: InMemoryCartRepository
let inMemoryCartItemsRepository: InMemoryCartItemsRepository
let inMemoryPaymentStripeRepository: InMemoryPaymentStripeRepository

let sut: CreateCheckoutSessionUseCase

describe('Create checkout session', () => {
  beforeEach(() => {
    inMemoryCartItemsRepository = new InMemoryCartItemsRepository()
    inMemoryDishAttachmentsRepository = new InMemoryDishAttachmentsRepository()
    inMemoryDishIngredientsRepository = new InMemoryDishIngredientsRepository()
    inMemoryCategoryRepository = new InMemoryCategoryRepository()
    inMemoryAttachmentsRepository = new InMemoryAttachmentsRepository()
    inMemoryDishRepository = new InMemoryDishRepository(
      inMemoryDishAttachmentsRepository,
      inMemoryDishIngredientsRepository,
      inMemoryCategoryRepository,
      inMemoryAttachmentsRepository,
    )
    inMemoryClientsRepository = new InMemoryClientsRepository()
    inMemoryCartRepository = new InMemoryCartRepository(
      inMemoryCartItemsRepository,
      inMemoryDishAttachmentsRepository,
      inMemoryAttachmentsRepository,
      inMemoryDishRepository,
      inMemoryClientsRepository,
    )
    inMemoryPaymentStripeRepository = new InMemoryPaymentStripeRepository()

    sut = new CreateCheckoutSessionUseCase(
      inMemoryCartRepository,
      inMemoryPaymentStripeRepository,
    )
  })

  it('should be able create a checkout session', async () => {
    const client = makeClient()

    await inMemoryClientsRepository.create(client)

    const newCart = makeCart({
      clientId: client.id,
    })

    await inMemoryCartRepository.create(newCart)

    const batata = makeDish()

    await inMemoryDishRepository.create(batata)

    inMemoryCartItemsRepository.items.push(
      makeCartItem({
        cartId: newCart.id,
        dishId: batata.id,
        quantity: 1,
      }),
    )

    const result = await sut.execute({
      cartId: newCart.id.toString(),
    })

    const cartItemsOnDb = inMemoryCartItemsRepository.items
    const cartsOnDb = inMemoryCartRepository.items

    expect(result.isRight()).toBe(true)

    expect(cartsOnDb).toHaveLength(1)
    expect(cartItemsOnDb).toHaveLength(1)

    result.isRight() &&
      expect(result.value.checkoutSessionUrl).toEqual(expect.any(String))
  })

  it('should not be able create a checkout session with a invalid cart id', async () => {
    const result = await sut.execute({
      cartId: 'invalid-cart-id',
    })

    const cartItemsOnDb = inMemoryCartItemsRepository.items
    const cartsOnDb = inMemoryCartRepository.items

    expect(result.isLeft()).toBe(true)

    expect(cartsOnDb).toHaveLength(0)
    expect(cartItemsOnDb).toHaveLength(0)

    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
