import { makeDish } from '@/test/factories/make-dish'
import { EditDishUseCase } from './edit-dish'
import { InMemoryDishRepository } from '@/test/repository/in-memory/in-memory-dish-repository'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'

let inMemoryDishRepository: InMemoryDishRepository
let sut: EditDishUseCase

describe('Edit Dish', () => {
  beforeEach(() => {
    inMemoryDishRepository = new InMemoryDishRepository()
    sut = new EditDishUseCase(inMemoryDishRepository)
  })

  it('should be able to edit a dish', async () => {
    const newDish = makeDish({}, new UniqueEntityId('dish-01'))

    await inMemoryDishRepository.create(newDish)

    await sut.execute({
      dishId: newDish.id.toString(),

      name: 'Tropeiro',
      category: 'Alimentação',
      description: 'Prato tradicional de minas',
      ingredients: ['Feijão', 'Bacon'],
      price: 3400,
    })

    expect(inMemoryDishRepository.items[0]).toMatchObject({
      name: 'Tropeiro',
      ingredients: ['Feijão', 'Bacon'],
    })
  })
})
