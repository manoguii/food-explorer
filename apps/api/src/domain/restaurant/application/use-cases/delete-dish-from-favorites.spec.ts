import { makeClient } from 'test/factories/make-client'
import { makeDish } from 'test/factories/make-dish'
import { makeFavoriteDish } from 'test/factories/make-favorite-dish'
import { InMemoryAttachmentsRepository } from 'test/repositories/in-memory-attachments-repository'
import { InMemoryCategoryRepository } from 'test/repositories/in-memory-category-repository'
import { InMemoryDishAttachmentsRepository } from 'test/repositories/in-memory-dish-attachments-repository'
import { InMemoryDishIngredientsRepository } from 'test/repositories/in-memory-dish-ingredients-repository'
import { InMemoryDishRepository } from 'test/repositories/in-memory-dish-repository'
import { InMemoryFavoriteDishRepository } from 'test/repositories/in-memory-favorite-dish-repository'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'

import { DeleteDishFromFavoritesUseCase } from './delete-dish-from-favorites'

describe('Delete Dish From Favorites UseCase', () => {
  let inMemoryDishIngredientsRepository: InMemoryDishIngredientsRepository
  let inMemoryCategoryRepository: InMemoryCategoryRepository
  let inMemoryDishAttachmentsRepository: InMemoryDishAttachmentsRepository
  let inMemoryAttachmentsRepository: InMemoryAttachmentsRepository
  let inMemoryDishRepository: InMemoryDishRepository
  let favoriteDishRepository: InMemoryFavoriteDishRepository
  let sut: DeleteDishFromFavoritesUseCase

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
    favoriteDishRepository = new InMemoryFavoriteDishRepository(
      inMemoryDishIngredientsRepository,
      inMemoryCategoryRepository,
      inMemoryDishAttachmentsRepository,
      inMemoryAttachmentsRepository,
      inMemoryDishRepository,
    )
    sut = new DeleteDishFromFavoritesUseCase(favoriteDishRepository)
  })

  it('should be able to delete dish as favorite', async () => {
    const dish = makeDish()
    const client = makeClient()

    inMemoryDishRepository.items.push(dish)

    await favoriteDishRepository.addFavoriteDish(
      makeFavoriteDish({
        dishId: dish.id,
        clientId: client.id,
      }),
    )

    expect(favoriteDishRepository.items).toHaveLength(1)

    const result = await sut.execute({
      clientId: client.id.toString(),
      dishId: dish.id.toString(),
    })

    expect(result.isRight()).toBe(true)
    expect(favoriteDishRepository.items).toHaveLength(0)
  })

  it('it should not be possible to delete the dish that does not exist', async () => {
    const client = makeClient({}, new UniqueEntityID('client-id'))

    const result = await sut.execute({
      clientId: client.id.toString(),
      dishId: 'non-existent-dish-id',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
    expect(favoriteDishRepository.items).toHaveLength(0)
  })
})
