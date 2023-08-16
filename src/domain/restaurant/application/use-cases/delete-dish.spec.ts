import { makeDish } from '@/test/factories/make-dish'
import { DeleteDishUseCase } from './delete-dish'
import { InMemoryDishRepository } from '@/test/repository/in-memory/in-memory-dish-repository'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'

let inMemoryDishRepository: InMemoryDishRepository
let sut: DeleteDishUseCase

describe('Delete Dish', () => {
  beforeEach(() => {
    inMemoryDishRepository = new InMemoryDishRepository()
    sut = new DeleteDishUseCase(inMemoryDishRepository)
  })

  it('should be able to delete a dish', async () => {
    const newDish = makeDish({}, new UniqueEntityId('dish-01'))

    await inMemoryDishRepository.create(newDish)

    await sut.execute({
      dishId: newDish.id.toString(),
    })

    expect(inMemoryDishRepository.items).toHaveLength(0)
  })
})
