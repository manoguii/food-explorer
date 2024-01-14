import { AddDishToCartUseCase } from './add-dish-to-cart'
import { InMemoryCartRepository } from 'test/repositories/in-memory-cart-repository'
import { makeCart } from 'test/factories/make-cart'

import { InMemoryCartItemsRepository } from 'test/repositories/in-memory-cart-item-repository'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { InMemoryDishRepository } from 'test/repositories/in-memory-dish-repository'
import { InMemoryDishAttachmentsRepository } from 'test/repositories/in-memory-dish-attachments-repository'
import { InMemoryAttachmentsRepository } from 'test/repositories/in-memory-attachments-repository'
import { InMemoryCategoryRepository } from 'test/repositories/in-memory-category-repository'
import { InMemoryDishIngredientsRepository } from 'test/repositories/in-memory-dish-ingredients-repository'
import { InMemoryClientsRepository } from 'test/repositories/in-memory-clients-repository'
import { makeDish } from 'test/factories/make-dish'

let inMemoryClientsRepository: InMemoryClientsRepository
let inMemoryDishIngredientsRepository: InMemoryDishIngredientsRepository
let inMemoryCategoryRepository: InMemoryCategoryRepository
let inMemoryDishRepository: InMemoryDishRepository
let inMemoryDishAttachmentsRepository: InMemoryDishAttachmentsRepository
let inMemoryAttachmentsRepository: InMemoryAttachmentsRepository

let inMemoryCartRepository: InMemoryCartRepository
let inMemoryCartItemsRepository: InMemoryCartItemsRepository

let sut: AddDishToCartUseCase

describe('Add dish to cart', () => {
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

    sut = new AddDishToCartUseCase(
      inMemoryCartRepository,
      inMemoryCartItemsRepository,
      inMemoryDishRepository,
    )
  })

  it('should be able to add dish to cart', async () => {
    const newCart = makeCart()

    await inMemoryCartRepository.create(newCart)

    const batata = makeDish()

    await inMemoryDishRepository.create(batata)

    const quantity = 2

    const result = await sut.execute({
      cartId: newCart.id.toString(),
      dishId: batata.id.toString(),
      quantity,
    })

    expect(result.isRight()).toBe(true)

    expect(inMemoryCartRepository.items).toHaveLength(1)
    expect(inMemoryCartItemsRepository.items).toHaveLength(1)

    expect(inMemoryCartItemsRepository.items[0].cost).toBe(
      quantity * batata.price,
    )

    const totalAmount = inMemoryCartItemsRepository.items.reduce(
      (acc, item) => {
        return acc + item.cost
      },
      0,
    )

    expect(inMemoryCartRepository.items[0].totalAmount).toBe(totalAmount)
  })

  it('should be able to increase the quantity of the dish if it already exists in the cart', async () => {
    const newCart = makeCart()

    await inMemoryCartRepository.create(newCart)

    const batata = makeDish()

    await inMemoryDishRepository.create(batata)

    await sut.execute({
      cartId: newCart.id.toString(),
      dishId: batata.id.toString(),
      quantity: 1,
    })

    const result = await sut.execute({
      cartId: newCart.id.toString(),
      dishId: batata.id.toString(),
      quantity: 1,
    })

    expect(result.isRight()).toBe(true)

    expect(inMemoryCartRepository.items).toHaveLength(1)
    expect(inMemoryCartItemsRepository.items).toHaveLength(1)

    expect(inMemoryCartItemsRepository.items[0].quantity).toBe(2)

    expect(inMemoryCartItemsRepository.items[0].cost).toBe(2 * batata.price)

    const totalAmount = inMemoryCartItemsRepository.items.reduce(
      (acc, item) => {
        return acc + item.cost
      },
      0,
    )

    expect(inMemoryCartRepository.items[0].totalAmount).toBe(totalAmount)
  })

  it('should not be able add dish to cart when the cart does not exist', async () => {
    const result = await sut.execute({
      cartId: 'invalid-cart-id',
      dishId: 'edited-dish',
      quantity: 1,
    })

    expect(result.isLeft()).toBe(true)

    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
