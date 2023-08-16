import { makeDish } from '@/test/factories/make-dish'
import { InMemoryDishRepository } from '@/test/repository/in-memory/in-memory-dish-repository'
import { FetchDishesByCategoryUseCase } from './fetch-dishes-by-category'

let inMemoryDishRepository: InMemoryDishRepository
let sut: FetchDishesByCategoryUseCase

describe('Get Dish by Slug', () => {
  beforeEach(() => {
    inMemoryDishRepository = new InMemoryDishRepository()
    sut = new FetchDishesByCategoryUseCase(inMemoryDishRepository)
  })

  it('should be able to fetch dishes by category', async () => {
    await inMemoryDishRepository.create(
      makeDish({ createdAt: new Date(2022, 0, 20), category: 'Bebidas' }),
    )
    await inMemoryDishRepository.create(
      makeDish({ createdAt: new Date(2022, 0, 18), category: 'Bebidas' }),
    )
    await inMemoryDishRepository.create(
      makeDish({ createdAt: new Date(2022, 0, 23), category: 'Bebidas' }),
    )
    await inMemoryDishRepository.create(
      makeDish({ createdAt: new Date(2022, 0, 23), category: 'Alimentação' }),
    )

    const { dishes } = await sut.execute({
      category: 'Bebidas',
      page: 1,
    })

    expect(dishes).toHaveLength(3)
    expect(dishes).toEqual([
      expect.objectContaining({ createdAt: new Date(2022, 0, 23) }),
      expect.objectContaining({ createdAt: new Date(2022, 0, 20) }),
      expect.objectContaining({ createdAt: new Date(2022, 0, 18) }),
    ])
  })

  it('should be able to fetch paginated dishes by category', async () => {
    for (let i = 1; i <= 24; i++) {
      await inMemoryDishRepository.create(makeDish({ category: 'Bebidas' }))
    }

    const { dishes } = await sut.execute({
      category: 'Bebidas',
      page: 2,
    })

    expect(dishes).toHaveLength(4)
  })
})
