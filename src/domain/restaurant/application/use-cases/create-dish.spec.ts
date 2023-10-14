import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { CreateDishUseCase } from './create-dish'
import { InMemoryDishRepository } from 'test/repositories/in-memory-dish-repository'
import { InMemoryDishIngredientsRepository } from 'test/repositories/in-memory-dish-ingredients-repository'
import { InMemoryDishAttachmentsRepository } from 'test/repositories/in-memory-dish-attachments-repository'

let inMemoryDishRepository: InMemoryDishRepository
let inMemoryDishAttachmentsRepository: InMemoryDishAttachmentsRepository
let inMemoryDishIngredientsRepository: InMemoryDishIngredientsRepository
let sut: CreateDishUseCase

describe('Create Dish', () => {
  beforeEach(() => {
    inMemoryDishAttachmentsRepository = new InMemoryDishAttachmentsRepository()
    inMemoryDishIngredientsRepository = new InMemoryDishIngredientsRepository()
    inMemoryDishRepository = new InMemoryDishRepository(
      inMemoryDishAttachmentsRepository,
      inMemoryDishIngredientsRepository,
    )
    sut = new CreateDishUseCase(inMemoryDishRepository)
  })

  it('should be able to create a dish', async () => {
    const result = await sut.execute({
      categoryId: '1',
      name: 'Dish name',
      description: 'Dish description',
      price: '1000',
      ingredientIds: ['1', '2'],
      attachmentsIds: ['10', '20'],
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryDishRepository.items[0]).toEqual(result.value?.dish)
    expect(
      inMemoryDishRepository.items[0].ingredients.currentItems,
    ).toHaveLength(2)
    expect(inMemoryDishRepository.items[0].ingredients.currentItems).toEqual([
      expect.objectContaining({ ingredientId: new UniqueEntityID('1') }),
      expect.objectContaining({ ingredientId: new UniqueEntityID('2') }),
    ])
    expect(
      inMemoryDishRepository.items[0].attachments.currentItems,
    ).toHaveLength(2)
    expect(inMemoryDishRepository.items[0].attachments.currentItems).toEqual([
      expect.objectContaining({ attachmentId: new UniqueEntityID('10') }),
      expect.objectContaining({ attachmentId: new UniqueEntityID('20') }),
    ])
  })
})
