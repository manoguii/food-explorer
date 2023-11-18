import { InMemoryDishRepository } from 'test/repositories/in-memory-dish-repository'
import { FetchFilteredDishesUseCase } from './fetch-filtered-dishes'
import { InMemoryDishAttachmentsRepository } from 'test/repositories/in-memory-dish-attachments-repository'
import { makeDish } from 'test/factories/make-dish'
import { InMemoryDishIngredientsRepository } from 'test/repositories/in-memory-dish-ingredients-repository'
import { InMemoryCategoryRepository } from 'test/repositories/in-memory-category-repository'
import { InMemoryAttachmentsRepository } from 'test/repositories/in-memory-attachments-repository'
import { makeCategory } from 'test/factories/make-category'

let inMemoryDishAttachmentRepository: InMemoryDishAttachmentsRepository
let inMemoryDishIngredientsRepository: InMemoryDishIngredientsRepository
let inMemoryDishRepository: InMemoryDishRepository
let inMemoryCategoryRepository: InMemoryCategoryRepository
let inMemoryAttachmentsRepository: InMemoryAttachmentsRepository
let sut: FetchFilteredDishesUseCase

describe('Fetch filtered dishes', () => {
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
    sut = new FetchFilteredDishesUseCase(inMemoryDishRepository)
  })

  it('should be able to fetch filtered dishes by query', async () => {
    const category = makeCategory({
      name: 'Bebidas',
    })

    await inMemoryCategoryRepository.create(category)

    await inMemoryDishRepository.create(
      makeDish({
        createdAt: new Date(2022, 0, 20),
        name: 'Salada de alface',
        categoryId: category.id,
      }),
    )
    await inMemoryDishRepository.create(
      makeDish({
        createdAt: new Date(2022, 0, 18),
        name: 'Molho de tomate',
        categoryId: category.id,
      }),
    )
    await inMemoryDishRepository.create(
      makeDish({
        createdAt: new Date(2022, 0, 23),
        name: 'Batata frita',
      }),
    )

    const result = await sut.execute({
      page: 1,
      query: 'de',
    })

    expect(result.value?.dishes).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: 'Salada de alface',
          ingredients: [],
          attachments: [],
        }),
        expect.objectContaining({
          name: 'Molho de tomate',
          ingredients: [],
          attachments: [],
        }),
      ]),
    )
  })

  it('should be able to fetch paginated filtered dishes', async () => {
    const category = makeCategory({
      name: 'Bebidas',
    })

    await inMemoryCategoryRepository.create(category)

    for (let i = 1; i <= 22; i++) {
      await inMemoryDishRepository.create(
        makeDish({
          name: `Dish ${i}`,
          categoryId: category.id,
        }),
      )
    }

    const result = await sut.execute({
      page: 3,
      query: 'Dish',
    })

    expect(result.value?.dishes).toHaveLength(2)
  })
})
