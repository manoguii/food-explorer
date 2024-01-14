import { DeleteDishToCartUseCase } from './delete-dish-to-cart'
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
import { makeCartItem } from 'test/factories/make-cart-item'

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

    const [batata, salada] = await Promise.all([makeDish(), makeDish()])

    await Promise.all([
      inMemoryDishRepository.create(batata),
      inMemoryDishRepository.create(salada),
    ])

    inMemoryCartItemsRepository.items.push(
      makeCartItem({
        cartId: newCart.id,
        dishId: batata.id,
        quantity: 1,
        dishPrice: batata.price,
      }),
      makeCartItem({
        cartId: newCart.id,
        dishId: salada.id,
        quantity: 1,
        dishPrice: salada.price,
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

    expect(cartItemsOnDb[0].cost).toBe(1 * salada.price)

    const totalAmount = cartItemsOnDb.reduce((acc, item) => {
      return acc + item.cost
    }, 0)

    expect(cartsOnDb[0].totalAmount).toBe(totalAmount)
  })

  it('should be able to delete cart when the cart is empty', async () => {
    const newCart = makeCart()

    await inMemoryCartRepository.create(newCart)

    const [batata, salada] = await Promise.all([makeDish(), makeDish()])

    await Promise.all([
      inMemoryDishRepository.create(batata),
      inMemoryDishRepository.create(salada),
    ])

    inMemoryCartItemsRepository.items.push(
      makeCartItem({
        cartId: newCart.id,
        dishId: batata.id,
        quantity: 1,
        dishPrice: batata.price,
      }),
      makeCartItem({
        cartId: newCart.id,
        dishId: salada.id,
        quantity: 1,
        dishPrice: salada.price,
      }),
    )

    const result = await sut.execute({
      cartId: newCart.id.toString(),
      dishId: batata.id.toString(),
    })

    expect(result.isRight()).toBe(true)

    expect(inMemoryCartRepository.items).toHaveLength(1)
    expect(inMemoryCartItemsRepository.items).toHaveLength(1)

    await sut.execute({
      cartId: newCart.id.toString(),
      dishId: salada.id.toString(),
    })

    expect(inMemoryCartItemsRepository.items).toHaveLength(0)
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
