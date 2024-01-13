import { DeleteCartUseCase } from './delete-cart'
import { InMemoryCartRepository } from 'test/repositories/in-memory-cart-repository'
import { makeCart } from 'test/factories/make-cart'

import { makeCartItem } from 'test/factories/make-cart-item'
import { InMemoryCartItemsRepository } from 'test/repositories/in-memory-cart-item-repository'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { InMemoryDishRepository } from 'test/repositories/in-memory-dish-repository'
import { InMemoryDishAttachmentsRepository } from 'test/repositories/in-memory-dish-attachments-repository'
import { InMemoryDishIngredientsRepository } from 'test/repositories/in-memory-dish-ingredients-repository'
import { InMemoryCategoryRepository } from 'test/repositories/in-memory-category-repository'
import { InMemoryAttachmentsRepository } from 'test/repositories/in-memory-attachments-repository'
import { makeDish } from 'test/factories/make-dish'
import { InMemoryClientsRepository } from 'test/repositories/in-memory-clients-repository'

let inMemoryClientsRepository: InMemoryClientsRepository
let inMemoryDishRepository: InMemoryDishRepository
let inMemoryDishAttachmentsRepository: InMemoryDishAttachmentsRepository
let inMemoryDishIngredientsRepository: InMemoryDishIngredientsRepository
let inMemoryCategoryRepository: InMemoryCategoryRepository
let inMemoryAttachmentsRepository: InMemoryAttachmentsRepository
let inMemoryCartRepository: InMemoryCartRepository
let inMemoryCartItemsRepository: InMemoryCartItemsRepository

let sut: DeleteCartUseCase

describe('Delete Cart', () => {
  beforeEach(() => {
    inMemoryDishAttachmentsRepository = new InMemoryDishAttachmentsRepository()
    inMemoryAttachmentsRepository = new InMemoryAttachmentsRepository()
    inMemoryDishIngredientsRepository = new InMemoryDishIngredientsRepository()
    inMemoryCategoryRepository = new InMemoryCategoryRepository()

    inMemoryDishRepository = new InMemoryDishRepository(
      inMemoryDishAttachmentsRepository,
      inMemoryDishIngredientsRepository,
      inMemoryCategoryRepository,
      inMemoryAttachmentsRepository,
    )

    inMemoryCartItemsRepository = new InMemoryCartItemsRepository()
    inMemoryClientsRepository = new InMemoryClientsRepository()
    inMemoryCartRepository = new InMemoryCartRepository(
      inMemoryCartItemsRepository,
      inMemoryDishAttachmentsRepository,
      inMemoryAttachmentsRepository,
      inMemoryDishRepository,
      inMemoryClientsRepository,
    )

    sut = new DeleteCartUseCase(inMemoryCartRepository)
  })

  it('should be able to delete a cart', async () => {
    const newCart = makeCart()

    await inMemoryCartRepository.create(newCart)

    const [batata, salada] = await Promise.all([makeDish(), makeDish()])

    inMemoryDishRepository.items.push(batata, salada)

    inMemoryCartItemsRepository.items.push(
      makeCartItem({
        cartId: newCart.id,
        quantity: 5,
      }),
      makeCartItem({
        cartId: newCart.id,
        quantity: 2,
      }),
    )

    const result = await sut.execute({
      cartId: newCart.id.toString(),
    })

    expect(result.isRight()).toBe(true)

    expect(inMemoryCartRepository.items).toHaveLength(0)
  })

  it('should not be able to delete a cart when it does not exist', async () => {
    const result = await sut.execute({
      cartId: 'invalid-cart-id',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
