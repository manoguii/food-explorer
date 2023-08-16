import { makeDish } from '@/test/factories/make-dish'
import { Slug } from '../../enterprise/entities/value-objects/slug'
import { GetDishBySlugUseCase } from './get-dish-by-slug'
import { InMemoryDishRepository } from '@/test/repository/in-memory/in-memory-dish-repository'

let inMemoryDishRepository: InMemoryDishRepository
let sut: GetDishBySlugUseCase

describe('Get Dish by Slug', () => {
  beforeEach(() => {
    inMemoryDishRepository = new InMemoryDishRepository()
    sut = new GetDishBySlugUseCase(inMemoryDishRepository)
  })

  it('should be able to get a dish by slug', async () => {
    const input = 'tropeiro-baiano'

    const newDish = makeDish({
      slug: Slug.create(input),
    })

    await inMemoryDishRepository.create(newDish)

    const { dish } = await sut.execute({
      slug: input,
    })

    expect(dish.id).toBeTruthy()
    expect(dish.slug.value).toEqual(input)
  })
})
