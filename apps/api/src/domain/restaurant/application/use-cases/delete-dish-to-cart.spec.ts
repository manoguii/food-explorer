import { makeCart } from 'test/factories/make-cart'
import { makeCartItem } from 'test/factories/make-cart-item'
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

import { DeleteDishToCartUseCase } from './delete-dish-to-cart'

let inMemoryClientsRepository: InMemoryClientsRepository
let inMemoryDishIngredientsRepository: InMemoryDishIngredientsRepository
let inMemoryCategoryRepository: InMemoryCategoryRepository
let inMemoryDishRepository: InMemoryDishRepository
let inMemoryDishAttachmentsRepository: InMemoryDishAttachmentsRepository
let inMemoryAttachmentsRepository: InMemoryAttachmentsRepository

let inMemoryCartRepository: InMemoryCartRepository
let inMemoryCartItemsRepository: InMemoryCartItemsRepository

let sut: DeleteDishToCartUseCase

describe('Delete dish to cart', () => {
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

    sut = new DeleteDishToCartUseCase(
      inMemoryCartRepository,
      inMemoryCartItemsRepository,
    )
  })

  it('should be able to delete dish to cart', async () => {
    const newCart = makeCart()
    await inMemoryCartRepository.create(newCart)

    const batata = makeDish()
    const salada = makeDish()
    inMemoryDishRepository.items.push(batata, salada)

    inMemoryCartItemsRepository.items.push(
      makeCartItem({
        cartId: newCart.id,
        dishId: batata.id,
        quantity: 1,
      }),
      makeCartItem({
        cartId: newCart.id,
        dishId: salada.id,
        quantity: 1,
      }),
    )

    const result = await sut.execute({
      cartId: newCart.id.toString(),
      dishId: batata.id.toString(),
    })

    const cartItemsOnDb = inMemoryCartItemsRepository.items
    const cartsOnDb = inMemoryCartRepository.items

    expect(result.isRight()).toBe(true)

    expect(cartsOnDb).toHaveLength(1)
    expect(cartItemsOnDb).toHaveLength(1)

    const totalAmount = cartItemsOnDb.reduce((acc, item) => {
      return acc + item.cost
    }, 0)

    expect(cartsOnDb[0].totalAmount).toBe(totalAmount)
  })

  it('should not be able delete dish to cart when the cart does not exist', async () => {
    const result = await sut.execute({
      cartId: 'invalid-cart-id',
      dishId: 'edited-dish',
    })

    expect(result.isLeft()).toBe(true)

    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
