import { InMemoryCartRepository } from 'test/repositories/in-memory-cart-repository'

import { InMemoryCartItemsRepository } from 'test/repositories/in-memory-cart-item-repository'
import { InMemoryDishRepository } from 'test/repositories/in-memory-dish-repository'
import { InMemoryDishAttachmentsRepository } from 'test/repositories/in-memory-dish-attachments-repository'
import { InMemoryAttachmentsRepository } from 'test/repositories/in-memory-attachments-repository'
import { InMemoryCategoryRepository } from 'test/repositories/in-memory-category-repository'
import { InMemoryDishIngredientsRepository } from 'test/repositories/in-memory-dish-ingredients-repository'
import { InMemoryClientsRepository } from 'test/repositories/in-memory-clients-repository'
import { CreateCheckoutSessionUseCase } from './create-checkout-session'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { InMemoryPaymentStripeRepository } from 'test/payment/in-memory-payment-stripe-repository'
import { CartAbstractFactory } from 'test/factories/cart-abstract-factory'

let inMemoryClientsRepository: InMemoryClientsRepository
let inMemoryDishIngredientsRepository: InMemoryDishIngredientsRepository
let inMemoryCategoryRepository: InMemoryCategoryRepository
let inMemoryDishRepository: InMemoryDishRepository
let inMemoryDishAttachmentsRepository: InMemoryDishAttachmentsRepository
let inMemoryAttachmentsRepository: InMemoryAttachmentsRepository
let inMemoryCartRepository: InMemoryCartRepository
let inMemoryCartItemsRepository: InMemoryCartItemsRepository
let inMemoryPaymentStripeRepository: InMemoryPaymentStripeRepository

let factory: CartAbstractFactory
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

    factory = new CartAbstractFactory(
      inMemoryCartRepository,
      inMemoryCartItemsRepository,
      inMemoryDishRepository,
      inMemoryClientsRepository,
    )

    sut = new CreateCheckoutSessionUseCase(
      inMemoryCartRepository,
      inMemoryPaymentStripeRepository,
    )
  })

  it('should be able create a checkout session', async () => {
    const { cart } = factory.createCartWithItems()

    const result = await sut.execute({
      cartId: cart.id.toString(),
    })

    const cartItemsOnDb = inMemoryCartItemsRepository.items
    const cartsOnDb = inMemoryCartRepository.items

    expect(result.isRight()).toBe(true)
    expect(cartsOnDb).toHaveLength(1)
    expect(cartItemsOnDb).toHaveLength(2)

    if (result.isRight()) {
      expect(result.value.checkoutSessionUrl).toEqual(expect.any(String))
    }
  })

  it('should not be able create a checkout session with a invalid cart id', async () => {
    const result = await sut.execute({
      cartId: 'invalid-cart-id',
    })

    expect(result.isLeft()).toBe(true)

    expect(inMemoryCartRepository.items).toHaveLength(0)
    expect(inMemoryCartItemsRepository.items).toHaveLength(0)

    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
