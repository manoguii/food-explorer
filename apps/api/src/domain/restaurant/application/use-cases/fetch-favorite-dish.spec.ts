import { makeDish } from 'test/factories/make-dish'
import { InMemoryFavoriteDishRepository } from 'test/repositories/in-memory-favorite-dish-repository'
import { FetchFavoriteDishesUseCase } from './fetch-favorite-dishes'
import { makeClient } from 'test/factories/make-client'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { makeFavoriteDish } from 'test/factories/make-favorite-dish'
import { InMemoryDishAttachmentsRepository } from 'test/repositories/in-memory-dish-attachments-repository'
import { InMemoryAttachmentsRepository } from 'test/repositories/in-memory-attachments-repository'
import { InMemoryDishRepository } from 'test/repositories/in-memory-dish-repository'
import { InMemoryCategoryRepository } from 'test/repositories/in-memory-category-repository'
import { InMemoryDishIngredientsRepository } from 'test/repositories/in-memory-dish-ingredients-repository'

let inMemoryFavoriteDishRepository: InMemoryFavoriteDishRepository
let inMemoryDishIngredientsRepository: InMemoryDishIngredientsRepository
let inMemoryCategoryRepository: InMemoryCategoryRepository
let inMemoryDishAttachmentsRepository: InMemoryDishAttachmentsRepository
let inMemoryAttachmentsRepository: InMemoryAttachmentsRepository
let inMemoryDishRepository: InMemoryDishRepository
let sut: FetchFavoriteDishesUseCase

describe('Fetch favorite dishes', () => {
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
    inMemoryFavoriteDishRepository = new InMemoryFavoriteDishRepository(
      inMemoryDishAttachmentsRepository,
      inMemoryAttachmentsRepository,
      inMemoryDishRepository,
    )
    sut = new FetchFavoriteDishesUseCase(inMemoryFavoriteDishRepository)
  })

  it('should be able to fetch favorite dishes', async () => {
    const client = makeClient({}, new UniqueEntityID('1'))
    const dish = makeDish({}, new UniqueEntityID('dish-1'))

    await inMemoryDishRepository.create(dish)

    await inMemoryFavoriteDishRepository.addFavoriteDish(
      makeFavoriteDish({
        clientId: client.id,
        dishId: dish.id,
      }),
    )

    const result = await sut.execute({
      page: 1,
      clientId: client.id.toString(),
    })

    expect(result.isRight()).toBe(true)
    expect(result.value?.favoriteDishes).toHaveLength(1)
  })
})
