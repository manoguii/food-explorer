import { GetDishBySlugUseCase } from './get-dish-by-slug'
import { InMemoryDishRepository } from 'test/repositories/in-memory-dish-repository'
import { Slug } from '@/domain/restaurant/enterprise/entities/value-objects/slug'
import { makeDish } from 'test/factories/make-dish'

let inMemoryDishRepository: InMemoryDishRepository
let sut: GetDishBySlugUseCase

describe('Get Dish By Slug', () => {
  beforeEach(() => {
    inMemoryDishRepository = new InMemoryDishRepository()
    sut = new GetDishBySlugUseCase(inMemoryDishRepository)
  })

  it('should be able to get a dish by slug', async () => {
    const newDish = makeDish({
      slug: Slug.create('example-dish'),
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
})
