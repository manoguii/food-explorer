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
    const { dish } = await sut.execute({
      name: 'Tropeiro',
      description: 'Prato mineiro',
      ingredients: ['Bacon', 'Feijão'],
      category: 'Mineiro',
    })

    expect(dish.name).toEqual('Tropeiro')
    expect(dish.id).toBeTruthy()
    expect(inMemoryDishRepository.items[0].id).toEqual(dish.id)
  })
})
