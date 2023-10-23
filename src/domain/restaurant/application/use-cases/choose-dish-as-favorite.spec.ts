import { ChooseDishAsFavoriteUseCase } from './choose-dish-as-favorite'
import { makeDish } from 'test/factories/make-dish'
import { makeClient } from 'test/factories/make-client'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ConflictExceptionError } from './errors/conflict-exception-error'
import { InMemoryFavoriteDishRepository } from 'test/repositories/in-memory-favorite-dish-repository'
import { FavoriteDish } from '../../enterprise/entities/favorite-dish'

describe('ChooseDishAsFavoriteUseCase', () => {
  let sut: ChooseDishAsFavoriteUseCase
  let favoriteDishRepository: InMemoryFavoriteDishRepository

  beforeEach(() => {
    favoriteDishRepository = new InMemoryFavoriteDishRepository()
    sut = new ChooseDishAsFavoriteUseCase(favoriteDishRepository)
  })

  it('should be able to choose dish as favorite', async () => {
    const dish = makeDish({}, new UniqueEntityID('dish-id'))
    const client = makeClient({}, new UniqueEntityID('client-id'))

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
