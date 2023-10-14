import { makeDish } from 'test/factories/make-dish'
import { InMemoryFavoriteDishRepository } from 'test/repositories/in-memory-favorite-dish-repository'
import { FetchFavoriteDishesUseCase } from './fetch-favorite-dishes'
import { makeClient } from 'test/factories/make-client'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { makeFavoriteDish } from 'test/factories/make-favorite-dish'

let inMemoryFavoriteDishRepository: InMemoryFavoriteDishRepository
let sut: FetchFavoriteDishesUseCase

describe('Fetch favorite dishes', () => {
  beforeEach(() => {
    inMemoryFavoriteDishRepository = new InMemoryFavoriteDishRepository()
    sut = new FetchFavoriteDishesUseCase(inMemoryFavoriteDishRepository)
  })

  it('should be able to fetch favorite dishes', async () => {
    const client = makeClient({}, new UniqueEntityID('1'))
    const dish = makeDish({}, new UniqueEntityID('dish-1'))

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
