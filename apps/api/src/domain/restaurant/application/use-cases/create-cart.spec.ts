import { CreateCartUseCase } from './create-cart'
import { InMemoryCartRepository } from 'test/repositories/in-memory-cart-repository'
import { InMemoryCartItemsRepository } from 'test/repositories/in-memory-cart-item-repository'
import { InMemoryDishRepository } from 'test/repositories/in-memory-dish-repository'
import { InMemoryDishAttachmentsRepository } from 'test/repositories/in-memory-dish-attachments-repository'
import { InMemoryDishIngredientsRepository } from 'test/repositories/in-memory-dish-ingredients-repository'
import { InMemoryCategoryRepository } from 'test/repositories/in-memory-category-repository'
import { InMemoryAttachmentsRepository } from 'test/repositories/in-memory-attachments-repository'
import { makeClient } from 'test/factories/make-client'
import { InMemoryClientsRepository } from 'test/repositories/in-memory-clients-repository'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'

let inMemoryClientsRepository: InMemoryClientsRepository
let inMemoryDishRepository: InMemoryDishRepository
let inMemoryDishAttachmentsRepository: InMemoryDishAttachmentsRepository
let inMemoryDishIngredientsRepository: InMemoryDishIngredientsRepository
let inMemoryCategoryRepository: InMemoryCategoryRepository
let inMemoryAttachmentsRepository: InMemoryAttachmentsRepository
let inMemoryCartRepository: InMemoryCartRepository
let inMemoryCartItemsRepository: InMemoryCartItemsRepository
let sut: CreateCartUseCase

describe('Create Cart', () => {
  beforeEach(() => {
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
    inMemoryCartItemsRepository = new InMemoryCartItemsRepository()
    inMemoryCartRepository = new InMemoryCartRepository(
      inMemoryCartItemsRepository,
      inMemoryDishAttachmentsRepository,
      inMemoryAttachmentsRepository,
      inMemoryDishRepository,
      inMemoryClientsRepository,
    )
    sut = new CreateCartUseCase(
      inMemoryCartRepository,
      inMemoryClientsRepository,
    )
  })

  it('should be able to create a cart', async () => {
    const client = makeClient()

    inMemoryClientsRepository.items.push(client)

    const result = await sut.execute({
      clientId: client.id.toString(),
    })

    expect(result.isRight()).toBe(true)

    expect(inMemoryCartRepository.items).toHaveLength(1)
  })

  it('should not be able to create a cart if client already has a empty cart', async () => {
    const client = makeClient()

    inMemoryClientsRepository.items.push(client)

    const result = await sut.execute({
      clientId: client.id.toString(),
    })

    expect(result.isRight()).toBe(true)

    const result2 = await sut.execute({
      clientId: client.id.toString(),
    })

    expect(result2.isRight()).toBe(true)

    expect(inMemoryCartRepository.items).toHaveLength(1)

    const cartIdOnDb = inMemoryCartRepository.items[0].id

    const firstCart = result.isRight() ? result.value.cart : null

    expect(cartIdOnDb).toBe(firstCart && firstCart.id)
  })

  it('should not be able to create a cart if client does not exists', async () => {
    const result = await sut.execute({
      clientId: 'non-existing-client-id',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
