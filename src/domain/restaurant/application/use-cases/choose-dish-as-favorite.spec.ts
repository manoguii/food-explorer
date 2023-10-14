import { ChooseDishAsFavoriteUseCase } from './choose-dish-as-favorite'
import { makeDish } from 'test/factories/make-dish'
import { makeClient } from 'test/factories/make-client'
import { InMemoryFavoriteDishRepository } from 'test/repositories/in-memory-favorite-dish-repository'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

let inMemoryFavoriteDishRepository: InMemoryFavoriteDishRepository
let sut: ChooseDishAsFavoriteUseCase

// TODO: Pending implementation
describe('Choose dish as favorite', () => {
  beforeEach(() => {
    inMemoryFavoriteDishRepository = new InMemoryFavoriteDishRepository()
    sut = new ChooseDishAsFavoriteUseCase(inMemoryFavoriteDishRepository)
  })

  it('should be able to choose dish as favorite', async () => {
    const dish = makeDish({}, new UniqueEntityID('dish-id'))
    const client = makeClient({}, new UniqueEntityID('client-id'))

    const result = await sut.execute({
      clientId: client.id.toString(),
      dishId: dish.id.toString(),
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryFavoriteDishRepository.items).toHaveLength(1)
  })
})
