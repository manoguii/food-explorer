import { DishAbstractFactory } from 'test/factories/dish-abstract-factory'
import { makeClient } from 'test/factories/make-client'
import { makeFavoriteDish } from 'test/factories/make-favorite-dish'
import { InMemoryAttachmentsRepository } from 'test/repositories/in-memory-attachments-repository'
import { InMemoryCategoryRepository } from 'test/repositories/in-memory-category-repository'
import { InMemoryDishAttachmentsRepository } from 'test/repositories/in-memory-dish-attachments-repository'
import { InMemoryDishIngredientsRepository } from 'test/repositories/in-memory-dish-ingredients-repository'
import { InMemoryDishRepository } from 'test/repositories/in-memory-dish-repository'
import { InMemoryFavoriteDishRepository } from 'test/repositories/in-memory-favorite-dish-repository'
import { InMemoryIngredientsRepository } from 'test/repositories/in-memory-ingredients-repository'

import { ChooseDishAsFavoriteUseCase } from './choose-dish-as-favorite'
import { ConflictExceptionError } from './errors/conflict-exception-error'

let inMemoryDishIngredientsRepository: InMemoryDishIngredientsRepository
let inMemoryCategoryRepository: InMemoryCategoryRepository
let inMemoryDishAttachmentsRepository: InMemoryDishAttachmentsRepository
let inMemoryAttachmentsRepository: InMemoryAttachmentsRepository
let inMemoryDishRepository: InMemoryDishRepository
let inMemoryFavoriteDishRepository: InMemoryFavoriteDishRepository
let inMemoryIngredientsRepository: InMemoryIngredientsRepository

let factory: DishAbstractFactory
let sut: ChooseDishAsFavoriteUseCase

describe('ChooseDishAsFavoriteUseCase', () => {
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
      inMemoryDishIngredientsRepository,
      inMemoryCategoryRepository,
      inMemoryDishAttachmentsRepository,
      inMemoryAttachmentsRepository,
      inMemoryDishRepository,
    )

    factory = new DishAbstractFactory(
      inMemoryDishRepository,
      inMemoryCategoryRepository,
      inMemoryAttachmentsRepository,
      inMemoryDishAttachmentsRepository,
      inMemoryIngredientsRepository,
      inMemoryDishIngredientsRepository,
    )

    sut = new ChooseDishAsFavoriteUseCase(inMemoryFavoriteDishRepository)
  })

  it('should be able to choose dish as favorite', async () => {
    const client = makeClient()

    const { dish } = factory.createDishWithCategory()

    const result = await sut.execute({
      clientId: client.id.toString(),
      dishId: dish.id.toString(),
      page: 1,
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryFavoriteDishRepository.items).toHaveLength(1)
  })

  it('should not be able to choose dish as favorite if it is already a favorite', async () => {
    const client = makeClient()

    const { dish } = factory.createDishWithCategory()

    inMemoryFavoriteDishRepository.items.push(
      makeFavoriteDish({
        clientId: client.id,
        dishId: dish.id,
      }),
    )

    const result = await sut.execute({
      clientId: client.id.toString(),
      dishId: dish.id.toString(),
      page: 1,
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ConflictExceptionError)
    expect(inMemoryFavoriteDishRepository.items).toHaveLength(1)
  })
})
