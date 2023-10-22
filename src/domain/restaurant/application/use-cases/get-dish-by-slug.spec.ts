import { GetDishBySlugUseCase } from './get-dish-by-slug'
import { InMemoryDishRepository } from 'test/repositories/in-memory-dish-repository'
import { Slug } from '@/domain/restaurant/enterprise/entities/value-objects/slug'
import { makeDish } from 'test/factories/make-dish'
import { InMemoryDishIngredientsRepository } from 'test/repositories/in-memory-dish-ingredients-repository'
import { InMemoryDishAttachmentsRepository } from 'test/repositories/in-memory-dish-attachments-repository'
import { InMemoryCategoryRepository } from 'test/repositories/in-memory-category-repository'
import { makeCategory } from 'test/factories/make-category'
import { makeIngredient } from 'test/factories/make-ingredient'
import { makeDishIngredient } from 'test/factories/make-dish-ingredient'

let inMemoryDishRepository: InMemoryDishRepository
let inMemoryDishAttachmentsRepository: InMemoryDishAttachmentsRepository
let inMemoryDishIngredientsRepository: InMemoryDishIngredientsRepository
let inMemoryCategoryRepository: InMemoryCategoryRepository
let sut: GetDishBySlugUseCase

describe('Get Dish By Slug', () => {
  beforeEach(() => {
    inMemoryDishAttachmentsRepository = new InMemoryDishAttachmentsRepository()
    inMemoryDishIngredientsRepository = new InMemoryDishIngredientsRepository()
    inMemoryCategoryRepository = new InMemoryCategoryRepository()
    inMemoryDishRepository = new InMemoryDishRepository(
      inMemoryDishAttachmentsRepository,
      inMemoryDishIngredientsRepository,
      inMemoryCategoryRepository,
    )
    sut = new GetDishBySlugUseCase(inMemoryDishRepository)
  })

  it('should be able to get a dish by slug', async () => {
    const category = makeCategory()

    await inMemoryCategoryRepository.create(category)

    const newDish = makeDish({
      slug: Slug.create('example-dish'),
      categoryId: category.id,
    })

    await inMemoryDishRepository.create(newDish)

    const result = await sut.execute({
      slug: 'example-dish',
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toMatchObject({
      dish: expect.objectContaining({
        name: newDish.name,
      }),
    })
  })

  it('should be able to return dish details', async () => {
    const category = makeCategory()
    await inMemoryCategoryRepository.create(category)

    const newDish = makeDish({
      slug: Slug.create('example-dish'),
      categoryId: category.id,
    })

    const ingredient = makeIngredient()
    const ingredient2 = makeIngredient()

    await inMemoryDishIngredientsRepository.createMany([
      makeDishIngredient({
        dishId: newDish.id,
        ingredientName: ingredient.name,
      }),
      makeDishIngredient({
        dishId: newDish.id,
        ingredientName: ingredient2.name,
      }),
    ])

    await inMemoryDishRepository.create(newDish)

    const result = await sut.execute({
      slug: 'example-dish',
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toMatchObject({
      dish: expect.objectContaining({
        name: newDish.name,
        category: category.name,
        ingredients: [ingredient.name, ingredient2.name],
      }),
    })
  })
})
