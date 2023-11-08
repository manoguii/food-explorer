import { EditDishUseCase } from './edit-dish'
import { InMemoryDishRepository } from 'test/repositories/in-memory-dish-repository'
import { makeDish } from 'test/factories/make-dish'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { InMemoryDishAttachmentsRepository } from 'test/repositories/in-memory-dish-attachments-repository'
import { InMemoryDishIngredientsRepository } from 'test/repositories/in-memory-dish-ingredients-repository'
import { makeDishAttachment } from 'test/factories/make-dish-attachment'
import { makeDishIngredient } from 'test/factories/make-dish-ingredient'
import { InMemoryCategoryRepository } from 'test/repositories/in-memory-category-repository'
import { InMemoryAttachmentsRepository } from 'test/repositories/in-memory-attachments-repository'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { makeCategory } from 'test/factories/make-category'

let inMemoryDishRepository: InMemoryDishRepository
let inMemoryDishAttachmentsRepository: InMemoryDishAttachmentsRepository
let inMemoryDishIngredientsRepository: InMemoryDishIngredientsRepository
let inMemoryCategoryRepository: InMemoryCategoryRepository
let inMemoryAttachmentsRepository: InMemoryAttachmentsRepository
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

    sut = new EditDishUseCase(
      inMemoryDishRepository,
      inMemoryDishAttachmentsRepository,
      inMemoryDishIngredientsRepository,
      inMemoryCategoryRepository,
    )
  })

  it('should be able to edit a dish', async () => {
    const category = makeCategory()

    await inMemoryCategoryRepository.create(category)

    const newDish = makeDish(
      {
        categoryId: category.id,
      },
      new UniqueEntityID('dish-1'),
    )

    await inMemoryDishRepository.create(newDish)

    // Cria inicialmente um prato com 2 arquivos e com 2 ingredientes

    inMemoryDishAttachmentsRepository.items.push(
      makeDishAttachment({
        attachmentId: new UniqueEntityID('attachment-1'),
        dishId: newDish.id,
      }),
      makeDishAttachment({
        attachmentId: new UniqueEntityID('attachment-2'),
        dishId: newDish.id,
      }),
    )
    inMemoryDishIngredientsRepository.items.push(
      makeDishIngredient({
        ingredientName: 'Laranja',
        dishId: newDish.id,
      }),
      makeDishIngredient({
        ingredientName: 'ingredient-to-remove',
        dishId: newDish.id,
      }),
    )

    const newCategory = makeCategory({
      name: 'Saladas',
    })

    await inMemoryCategoryRepository.create(newCategory)

    // Edita o prato com 1 arquivo novo e um antigo, o mesmo para os ingredientes

    const result = await sut.execute({
      dishId: newDish.id.toValue(),
      description: 'Dish description',
      name: 'Dish name',
      price: 1000,
      attachmentsIds: ['attachment-1', 'new-attachment'],
      ingredients: ['Laranja', 'new-ingredient'],
      categoryId: newCategory.id.toValue(),
    })

    // Espera-se que nos currentItems tenha 1 arquivo novo e um antigo, o mesmo para os ingredientes
    expect(result.isRight()).toBe(true)
    expect(
      inMemoryDishRepository.items[0].attachments.currentItems,
    ).toHaveLength(2)
    expect(inMemoryDishRepository.items[0].attachments.currentItems).toEqual([
      expect.objectContaining({
        attachmentId: new UniqueEntityID('attachment-1'),
      }),
      expect.objectContaining({
        attachmentId: new UniqueEntityID('new-attachment'),
      }),
    ])
    expect(
      inMemoryDishRepository.items[0].ingredients.currentItems,
    ).toHaveLength(2)
    expect(inMemoryDishRepository.items[0].ingredients.currentItems).toEqual([
      expect.objectContaining({
        ingredientName: 'Laranja',
      }),
      expect.objectContaining({
        ingredientName: 'new-ingredient',
      }),
    ])
    expect(inMemoryDishRepository.items[0].categoryId).toEqual(newCategory.id)
  })

  it('should sync new and removed attachments when edit a dish', async () => {
    const category = makeCategory()

    await inMemoryCategoryRepository.create(category)

    const newDish = makeDish(
      {
        categoryId: category.id,
      },
      new UniqueEntityID('dish-1'),
    )

    await inMemoryDishRepository.create(newDish)

    inMemoryDishAttachmentsRepository.items.push(
      makeDishAttachment({
        attachmentId: new UniqueEntityID('attachment-1'),
        dishId: newDish.id,
      }),
      makeDishAttachment({
        attachmentId: new UniqueEntityID('attachment-2'),
        dishId: newDish.id,
      }),
    )

    const result = await sut.execute({
      dishId: newDish.id.toValue(),
      description: 'Dish description',
      name: 'Dish name',
      price: 1000,
      attachmentsIds: ['attachment-1', 'new-attachment'],
      ingredients: ['Batata', 'Laranja'],
      categoryId: category.id.toValue(),
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryDishAttachmentsRepository.items).toHaveLength(2)
    expect(inMemoryDishAttachmentsRepository.items).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          attachmentId: new UniqueEntityID('attachment-1'),
        }),
        expect.objectContaining({
          attachmentId: new UniqueEntityID('new-attachment'),
        }),
      ]),
    )
  })

  it('should sync new and removed ingredients when edit a dish', async () => {
    const category = makeCategory()

    await inMemoryCategoryRepository.create(category)

    const newDish = makeDish(
      {
        categoryId: category.id,
      },
      new UniqueEntityID('dish-1'),
    )

    await inMemoryDishRepository.create(newDish)

    inMemoryDishIngredientsRepository.items.push(
      makeDishIngredient({
        ingredientName: 'Batata',
        dishId: newDish.id,
      }),
      makeDishIngredient({
        ingredientName: 'ingredient-to-remove',
        dishId: newDish.id,
      }),
    )

    const result = await sut.execute({
      dishId: newDish.id.toValue(),
      description: 'Dish description',
      name: 'Dish name',
      price: 1000,
      attachmentsIds: ['1', '2'],
      ingredients: ['Batata', 'new-ingredient'],
      categoryId: category.id.toValue(),
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryDishIngredientsRepository.items).toHaveLength(2)
    expect(inMemoryDishIngredientsRepository.items).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          ingredientName: 'Batata',
        }),
        expect.objectContaining({
          ingredientName: 'new-ingredient',
        }),
      ]),
    )
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
