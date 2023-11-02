import { ChooseDishAsFavoriteUseCase } from './choose-dish-as-favorite'
import { makeDish } from 'test/factories/make-dish'
import { makeClient } from 'test/factories/make-client'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ConflictExceptionError } from './errors/conflict-exception-error'
import { InMemoryFavoriteDishRepository } from 'test/repositories/in-memory-favorite-dish-repository'
import { FavoriteDish } from '../../enterprise/entities/favorite-dish'
import { InMemoryDishIngredientsRepository } from 'test/repositories/in-memory-dish-ingredients-repository'
import { InMemoryCategoryRepository } from 'test/repositories/in-memory-category-repository'
import { InMemoryDishAttachmentsRepository } from 'test/repositories/in-memory-dish-attachments-repository'
import { InMemoryAttachmentsRepository } from 'test/repositories/in-memory-attachments-repository'
import { InMemoryDishRepository } from 'test/repositories/in-memory-dish-repository'

describe('ChooseDishAsFavoriteUseCase', () => {
  let inMemoryDishIngredientsRepository: InMemoryDishIngredientsRepository
  let inMemoryCategoryRepository: InMemoryCategoryRepository
  let inMemoryDishAttachmentsRepository: InMemoryDishAttachmentsRepository
  let inMemoryAttachmentsRepository: InMemoryAttachmentsRepository
  let inMemoryDishRepository: InMemoryDishRepository
  let favoriteDishRepository: InMemoryFavoriteDishRepository
  let sut: ChooseDishAsFavoriteUseCase

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
      inMemoryDishAttachmentsRepository,
      inMemoryAttachmentsRepository,
      inMemoryDishRepository,
    )
    sut = new ChooseDishAsFavoriteUseCase(favoriteDishRepository)
  })

  it('should be able to choose dish as favorite', async () => {
    const dish = makeDish({}, new UniqueEntityID('dish-id'))
    const client = makeClient({}, new UniqueEntityID('client-id'))

    await inMemoryDishRepository.create(dish)

    const result = await sut.execute({
      clientId: client.id.toString(),
      dishId: dish.id.toString(),
      page: 1,
    })

    expect(result.isRight()).toBe(true)
    expect(favoriteDishRepository.items).toHaveLength(1)
  })

  it('should not be able to choose dish as favorite if it is already a favorite', async () => {
    const dish = makeDish({}, new UniqueEntityID('dish-id'))
    const client = makeClient({}, new UniqueEntityID('client-id'))

    await inMemoryDishRepository.create(dish)

    await favoriteDishRepository.addFavoriteDish(
      FavoriteDish.create({
        dishId: new UniqueEntityID(dish.id.toString()),
        clientId: new UniqueEntityID(client.id.toString()),
      }),
    )

    const result = await sut.execute({
      clientId: client.id.toString(),
      dishId: dish.id.toString(),
      page: 1,
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ConflictExceptionError)
    expect(favoriteDishRepository.items).toHaveLength(1)
  })
})
