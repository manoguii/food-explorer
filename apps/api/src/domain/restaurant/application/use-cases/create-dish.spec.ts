import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { CreateDishUseCase } from './create-dish'
import { InMemoryDishRepository } from 'test/repositories/in-memory-dish-repository'
import { InMemoryDishIngredientsRepository } from 'test/repositories/in-memory-dish-ingredients-repository'
import { InMemoryDishAttachmentsRepository } from 'test/repositories/in-memory-dish-attachments-repository'
import { InvalidIngredientsTypeError } from './errors/invalid-ingredients-type-error'
import { InvalidPriceError } from './errors/invalid-price-error'
import { InMemoryCategoryRepository } from 'test/repositories/in-memory-category-repository'
import { InMemoryAttachmentsRepository } from 'test/repositories/in-memory-attachments-repository'

let inMemoryDishRepository: InMemoryDishRepository
let inMemoryDishAttachmentsRepository: InMemoryDishAttachmentsRepository
let inMemoryDishIngredientsRepository: InMemoryDishIngredientsRepository
let inMemoryCategoryRepository: InMemoryCategoryRepository
let inMemoryAttachmentsRepository: InMemoryAttachmentsRepository
let sut: CreateDishUseCase

describe('Create Dish', () => {
  beforeEach(() => {
    inMemoryDishAttachmentsRepository = new InMemoryDishAttachmentsRepository()
    inMemoryDishIngredientsRepository = new InMemoryDishIngredientsRepository()
    inMemoryCategoryRepository = new InMemoryCategoryRepository()
    inMemoryAttachmentsRepository = new InMemoryAttachmentsRepository()
    inMemoryDishRepository = new InMemoryDishRepository(
      inMemoryDishAttachmentsRepository,
      inMemoryDishIngredientsRepository,
      inMemoryCategoryRepository,
      inMemoryAttachmentsRepository,
    )
    sut = new CreateDishUseCase(inMemoryDishRepository)
  })

  it('should be able to create a dish', async () => {
    const result = await sut.execute({
      categoryId: '1',
      name: 'Dish name',
      description: 'Dish description',
      price: 1000,
      ingredients: ['Arroz', 'Feijão'],
      attachmentsIds: ['10', '20'],
    })

    const dishOnDatabase = inMemoryDishRepository.items[0]

    expect(result.isRight()).toBe(true)

    expect(dishOnDatabase.ingredients.currentItems).toHaveLength(2)
    expect(dishOnDatabase.attachments.currentItems).toHaveLength(2)
    expect(dishOnDatabase.attachments.currentItems).toEqual([
      expect.objectContaining({ attachmentId: new UniqueEntityID('10') }),
      expect.objectContaining({ attachmentId: new UniqueEntityID('20') }),
    ])
    if ('dish' in result.value) {
      expect(dishOnDatabase).toEqual(result.value?.dish)
    }
  })

  it('should return an error when no ingredients are provided', async () => {
    const result = await sut.execute({
      categoryId: '1',
      name: 'Dish name',
      description: 'Dish description',
      price: 1000,
      ingredients: [],
      attachmentsIds: ['10', '20'],
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(InvalidIngredientsTypeError)
  })

  it('should return an error when an invalid price is provided', async () => {
    const result = await sut.execute({
      categoryId: '1',
      name: 'Dish name',
      description: 'Dish description',
      price: -1000,
      ingredients: ['Arroz', 'Feijão'],
      attachmentsIds: ['10', '20'],
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(InvalidPriceError)
  })

  it('should persist attachments when creating a new dish', async () => {
    const result = await sut.execute({
      categoryId: '1',
      name: 'Dish name',
      description: 'Dish description',
      price: 1000,
      ingredients: ['Arroz', 'Feijão'],
      attachmentsIds: ['10', '20'],
    })

    expect(result.isRight()).toBe(true)

    expect(inMemoryDishAttachmentsRepository.items).toHaveLength(2)
    expect(inMemoryDishAttachmentsRepository.items).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ attachmentId: new UniqueEntityID('10') }),
        expect.objectContaining({ attachmentId: new UniqueEntityID('20') }),
      ]),
    )
  })

  it('should persist ingredients when creating a new dish', async () => {
    const result = await sut.execute({
      categoryId: '1',
      name: 'Dish name',
      description: 'Dish description',
      price: 1000,
      ingredients: ['Arroz', 'Feijão', 'Batata'],
      attachmentsIds: ['10', '20'],
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryDishIngredientsRepository.items).toHaveLength(3)
  })
})
