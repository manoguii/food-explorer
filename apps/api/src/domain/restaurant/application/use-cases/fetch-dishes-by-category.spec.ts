import { makeCategory } from 'test/factories/make-category'
import { makeClient } from 'test/factories/make-client'
import { makeDish } from 'test/factories/make-dish'
import { makeFavoriteDish } from 'test/factories/make-favorite-dish'
import { InMemoryAttachmentsRepository } from 'test/repositories/in-memory-attachments-repository'
import { InMemoryCategoryRepository } from 'test/repositories/in-memory-category-repository'
import { InMemoryDishAttachmentsRepository } from 'test/repositories/in-memory-dish-attachments-repository'
import { InMemoryDishIngredientsRepository } from 'test/repositories/in-memory-dish-ingredients-repository'
import { InMemoryDishRepository } from 'test/repositories/in-memory-dish-repository'
import { InMemoryFavoriteDishRepository } from 'test/repositories/in-memory-favorite-dish-repository'

import { InvalidCategoryError } from './errors/invalid-category-error'
import { FetchDishesByCategoryUseCase } from './fetch-dishes-by-category'

let inMemoryDishAttachmentRepository: InMemoryDishAttachmentsRepository
let inMemoryDishIngredientsRepository: InMemoryDishIngredientsRepository
let inMemoryDishRepository: InMemoryDishRepository
let inMemoryCategoryRepository: InMemoryCategoryRepository
let inMemoryAttachmentsRepository: InMemoryAttachmentsRepository
let inMemoryFavoriteDishRepository: InMemoryFavoriteDishRepository
let sut: FetchDishesByCategoryUseCase

describe('Fetch dishes by category', () => {
  beforeEach(() => {
    inMemoryDishAttachmentRepository = new InMemoryDishAttachmentsRepository()
    inMemoryDishIngredientsRepository = new InMemoryDishIngredientsRepository()
    inMemoryCategoryRepository = new InMemoryCategoryRepository()
    inMemoryAttachmentsRepository = new InMemoryAttachmentsRepository()
    inMemoryDishRepository = new InMemoryDishRepository(
      inMemoryDishAttachmentRepository,
      inMemoryDishIngredientsRepository,
      inMemoryCategoryRepository,
      inMemoryAttachmentsRepository,
    )
    inMemoryFavoriteDishRepository = new InMemoryFavoriteDishRepository(
      inMemoryDishIngredientsRepository,
      inMemoryCategoryRepository,
      inMemoryDishAttachmentRepository,
      inMemoryAttachmentsRepository,
      inMemoryDishRepository,
    )
    sut = new FetchDishesByCategoryUseCase(
      inMemoryDishRepository,
      inMemoryCategoryRepository,
      inMemoryFavoriteDishRepository,
    )
  })

  it('should be able to fetch dishes by category', async () => {
    const client = makeClient()

    const category = makeCategory({
      name: 'Bebidas',
    })

    const category2 = makeCategory({
      name: 'Sobremesas',
    })

    await inMemoryCategoryRepository.create(category)
    await inMemoryCategoryRepository.create(category2)

    const dish = makeDish({
      name: 'Coca Cola',
      categoryId: category.id,
    })

    await inMemoryDishRepository.create(dish)

    inMemoryFavoriteDishRepository.items.push(
      makeFavoriteDish({
        clientId: client.id,
        dishId: dish.id,
      }),
    )

    await inMemoryDishRepository.create(
      makeDish({
        name: 'Petit Gateau',
        categoryId: category2.id,
      }),
    )

    await inMemoryDishRepository.create(
      makeDish({
        name: 'Suco de Laranja',
        categoryId: category.id,
      }),
    )

    const result = await sut.execute({
      category: 'Bebidas',
      clientId: client.id.toString(),
      page: 1,
    })

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(result.value?.dishes).toHaveLength(2)

      expect(result.value?.dishes).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            name: 'Coca Cola',
            ingredients: [],
            attachments: [],
            isFavorite: true,
          }),
          expect.objectContaining({
            name: 'Suco de Laranja',
            ingredients: [],
            attachments: [],
          }),
        ]),
      )
    }
  })

  it('should not be able to fetch dishes by category if category does not exists', async () => {
    const client = makeClient()

    await inMemoryDishRepository.create(
      makeDish({
        name: 'Coca Cola',
      }),
    )

    const result = await sut.execute({
      category: 'Bebidas',
      clientId: client.id.toString(),
      page: 1,
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(InvalidCategoryError)
  })
})
