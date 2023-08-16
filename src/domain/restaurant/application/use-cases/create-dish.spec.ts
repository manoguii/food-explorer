import { CreateDishUseCase } from './create-dish'
import { InMemoryDishRepository } from '@/test/repository/in-memory/in-memory-dish-repository'

let inMemoryDishRepository: InMemoryDishRepository
let sut: CreateDishUseCase

describe('Create Dish', () => {
  beforeEach(() => {
    inMemoryDishRepository = new InMemoryDishRepository()
    sut = new CreateDishUseCase(inMemoryDishRepository)
  })

  it('should be able to create a dish', async () => {
    const result = await sut.execute({
      name: 'Tropeiro',
      description: 'Prato mineiro',
      ingredients: ['Bacon', 'Feijão'],
      category: 'Mineiro',
      price: 1299,
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryDishRepository.items[0]).toEqual(result.value?.dish)
  })
})
