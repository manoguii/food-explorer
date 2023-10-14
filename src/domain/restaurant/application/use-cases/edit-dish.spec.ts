import { EditDishUseCase } from './edit-dish'
import { InMemoryDishRepository } from 'test/repositories/in-memory-dish-repository'
import { makeDish } from 'test/factories/make-dish'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

let inMemoryDishRepository: InMemoryDishRepository
let sut: EditDishUseCase

describe('Edit Dish', () => {
  beforeEach(() => {
    inMemoryDishRepository = new InMemoryDishRepository()

    sut = new EditDishUseCase(inMemoryDishRepository)
  })

  it('should be able to edit a dish', async () => {
    const newDish = makeDish({}, new UniqueEntityID('dish-1'))

    await inMemoryDishRepository.create(newDish)

    const result = await sut.execute({
      dishId: newDish.id.toValue(),
      description: 'Dish description',
      name: 'Dish name',
      price: '1000',
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryDishRepository.items[0].name).toBe('Dish name')
    expect(inMemoryDishRepository.items[0].description).toBe('Dish description')
    expect(inMemoryDishRepository.items[0].price).toBe('1000')
  })
})
