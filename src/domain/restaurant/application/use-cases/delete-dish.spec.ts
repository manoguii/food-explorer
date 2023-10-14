import { DeleteDishUseCase } from './delete-dish'
import { InMemoryDishRepository } from 'test/repositories/in-memory-dish-repository'
import { makeDish } from 'test/factories/make-dish'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

let inMemoryDishRepository: InMemoryDishRepository
let sut: DeleteDishUseCase

describe('Delete Dish', () => {
  beforeEach(() => {
    inMemoryDishRepository = new InMemoryDishRepository()

    sut = new DeleteDishUseCase(inMemoryDishRepository)
  })

  it('should be able to delete a dish', async () => {
    const newDish = makeDish({}, new UniqueEntityID('dish-1'))

    await inMemoryDishRepository.create(newDish)

    await sut.execute({
      dishId: 'dish-1',
    })

    expect(inMemoryDishRepository.items).toHaveLength(0)
  })
})
