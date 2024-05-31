import { DishAbstractFactory } from 'test/factories/dish-abstract-factory'
import { InMemoryAttachmentsRepository } from 'test/repositories/in-memory-attachments-repository'
import { InMemoryCategoryRepository } from 'test/repositories/in-memory-category-repository'
import { InMemoryDishAttachmentsRepository } from 'test/repositories/in-memory-dish-attachments-repository'
import { InMemoryDishIngredientsRepository } from 'test/repositories/in-memory-dish-ingredients-repository'
import { InMemoryDishRepository } from 'test/repositories/in-memory-dish-repository'
import { InMemoryIngredientsRepository } from 'test/repositories/in-memory-ingredients-repository'

import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'

import { EditDishUseCase } from './edit-dish'

let inMemoryDishRepository: InMemoryDishRepository
let inMemoryIngredientsRepository: InMemoryIngredientsRepository
let inMemoryDishAttachmentsRepository: InMemoryDishAttachmentsRepository
let inMemoryDishIngredientsRepository: InMemoryDishIngredientsRepository
let inMemoryCategoryRepository: InMemoryCategoryRepository
let inMemoryAttachmentsRepository: InMemoryAttachmentsRepository

let factory: DishAbstractFactory
let sut: EditDishUseCase

describe('Edit Dish', () => {
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

    inMemoryIngredientsRepository = new InMemoryIngredientsRepository()

    sut = new EditDishUseCase(
      inMemoryDishRepository,
      inMemoryDishAttachmentsRepository,
      inMemoryDishIngredientsRepository,
      inMemoryCategoryRepository,
    )

    factory = new DishAbstractFactory(
      inMemoryDishRepository,
      inMemoryCategoryRepository,
      inMemoryAttachmentsRepository,
      inMemoryDishAttachmentsRepository,
      inMemoryIngredientsRepository,
      inMemoryDishIngredientsRepository,
    )
  })

  it('should be able to edit a dish', async () => {
    const { dish, attachments, ingredients } = factory.createCompletedDish()

    const newCategory = factory.createCategory()
    const newAttachment = factory.createAttachment()
    const newIngredient = factory.createIngredient()

    const result = await sut.execute({
      dishId: dish.id.toValue(),
      description: 'New description',
      name: 'New name',
      price: 1000,

      attachmentsIds: [
        attachments[0].id.toString(),
        newAttachment.id.toString(),
      ],
      ingredients: [ingredients[0].name, newIngredient.name],
      categoryId: newCategory.id.toValue(),
    })

    expect(result.isRight()).toBe(true)

    const updatedDish = inMemoryDishRepository.items[0]

    expect(updatedDish.description).toEqual('New description')
    expect(updatedDish.name).toEqual('New name')
    expect(updatedDish.price).toEqual(1000)

    expect(updatedDish.attachments.currentItems).toHaveLength(2)
    expect(updatedDish.attachments.currentItems).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ attachmentId: newAttachment.id }),
      ]),
    )

    expect(updatedDish.ingredients.currentItems).toHaveLength(2)
    expect(updatedDish.ingredients.currentItems).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ ingredientName: newIngredient.name }),
      ]),
    )

    expect(updatedDish.categoryId).toEqual(newCategory.id)
  })

  it('should not be able to edit a dish when it does not exist', async () => {
    const result = await sut.execute({
      dishId: 'invalid-dish-id',
      description: 'Dish description',
      name: 'Dish name',
      price: 1000,
      attachmentsIds: ['1', '2'],
      ingredients: ['Batata', 'Laranja'],
      categoryId: 'category-id',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
