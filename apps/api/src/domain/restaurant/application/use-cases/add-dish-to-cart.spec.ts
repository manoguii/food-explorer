import { CartAbstractFactory } from 'test/factories/cart-abstract-factory'
import { makeDish } from 'test/factories/make-dish'
import { InMemoryAttachmentsRepository } from 'test/repositories/in-memory-attachments-repository'
import { InMemoryCartItemsRepository } from 'test/repositories/in-memory-cart-item-repository'
import { InMemoryCartRepository } from 'test/repositories/in-memory-cart-repository'
import { InMemoryCategoryRepository } from 'test/repositories/in-memory-category-repository'
import { InMemoryClientsRepository } from 'test/repositories/in-memory-clients-repository'
import { InMemoryDishAttachmentsRepository } from 'test/repositories/in-memory-dish-attachments-repository'
import { InMemoryDishIngredientsRepository } from 'test/repositories/in-memory-dish-ingredients-repository'
import { InMemoryDishRepository } from 'test/repositories/in-memory-dish-repository'

import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'

import { AddDishToCartUseCase } from './add-dish-to-cart'

let inMemoryClientsRepository: InMemoryClientsRepository
let inMemoryDishIngredientsRepository: InMemoryDishIngredientsRepository
let inMemoryCategoryRepository: InMemoryCategoryRepository
let inMemoryDishRepository: InMemoryDishRepository
let inMemoryDishAttachmentsRepository: InMemoryDishAttachmentsRepository
let inMemoryAttachmentsRepository: InMemoryAttachmentsRepository
let inMemoryCartRepository: InMemoryCartRepository
let inMemoryCartItemsRepository: InMemoryCartItemsRepository

let factory: CartAbstractFactory
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

    factory = new CartAbstractFactory(
      inMemoryCartRepository,
      inMemoryCartItemsRepository,
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
    const { cart } = factory.createCart()
    const dish = makeDish()
    inMemoryDishRepository.items.push(dish)

    const DISH_QUANTITY = 2

    const result = await sut.execute({
      cartId: cart.id.toString(),
      dishId: dish.id.toString(),
      quantity: DISH_QUANTITY,
    })

    const totalAmount = inMemoryCartItemsRepository.items.reduce(
      (acc, item) => {
        return acc + item.cost
      },
      0,
    )

    expect(result.isRight()).toBe(true)

    expect(inMemoryCartRepository.items).toHaveLength(1)
    expect(inMemoryCartRepository.items[0].totalAmount).toBe(totalAmount)

    expect(inMemoryCartItemsRepository.items).toHaveLength(1)
    expect(inMemoryCartItemsRepository.items[0].cost).toBe(
      DISH_QUANTITY * dish.price,
    )
  })

  it('should be able to increase the quantity of the dish if it already exists in the cart', async () => {
    const { cart } = factory.createCart()

    const dish = makeDish()
    inMemoryDishRepository.items.push(dish)

    const DISH_QUANTITY = 2

    await sut.execute({
      cartId: cart.id.toString(),
      dishId: dish.id.toString(),
      quantity: DISH_QUANTITY,
    })

    const result = await sut.execute({
      cartId: cart.id.toString(),
      dishId: dish.id.toString(),
      quantity: DISH_QUANTITY,
    })

    const totalAmount = inMemoryCartItemsRepository.items.reduce(
      (acc, item) => {
        return acc + item.cost
      },
      0,
    )

    expect(result.isRight()).toBe(true)

    expect(inMemoryCartRepository.items).toHaveLength(1)
    expect(inMemoryCartRepository.items[0].totalAmount).toBe(totalAmount)

    expect(inMemoryCartItemsRepository.items).toHaveLength(1)
    expect(inMemoryCartItemsRepository.items[0].quantity).toBe(4)
    expect(inMemoryCartItemsRepository.items[0].cost).toBe(4 * dish.price)
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
