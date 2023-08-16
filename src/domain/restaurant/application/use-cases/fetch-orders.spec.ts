import { makeOrder } from '@/test/factories/make-order'
import { InMemoryOrderRepository } from '@/test/repository/in-memory/in-memory-order-repository'
import { FetchOrdersUseCase } from './fetch-orders'

let inMemoryOrderRepository: InMemoryOrderRepository
let sut: FetchOrdersUseCase

describe('Get Order by Slug', () => {
  beforeEach(() => {
    inMemoryOrderRepository = new InMemoryOrderRepository()
    sut = new FetchOrdersUseCase(inMemoryOrderRepository)
  })

  it('should be able to fetch orders by category', async () => {
    await inMemoryOrderRepository.create(
      makeOrder({ createdAt: new Date(2022, 0, 20) }),
    )
    await inMemoryOrderRepository.create(
      makeOrder({ createdAt: new Date(2022, 0, 18) }),
    )
    await inMemoryOrderRepository.create(
      makeOrder({ createdAt: new Date(2022, 0, 23) }),
    )
    await inMemoryOrderRepository.create(
      makeOrder({ createdAt: new Date(2022, 0, 30) }),
    )

    const result = await sut.execute({
      page: 1,
    })

    expect(result.isRight()).toBe(true)

    if (result.isRight()) {
      expect(result.value.orders).toHaveLength(4)
      expect(result.value.orders).toEqual([
        expect.objectContaining({ createdAt: new Date(2022, 0, 30) }),
        expect.objectContaining({ createdAt: new Date(2022, 0, 23) }),
        expect.objectContaining({ createdAt: new Date(2022, 0, 20) }),
        expect.objectContaining({ createdAt: new Date(2022, 0, 18) }),
      ])
    }
  })

  it('should be able to fetch paginated orders by category', async () => {
    for (let i = 1; i <= 24; i++) {
      await inMemoryOrderRepository.create(makeOrder())
    }

    const result = await sut.execute({
      page: 2,
    })

    expect(result.isRight()).toBe(true)

    if (result.isRight()) {
      expect(result.value.orders).toHaveLength(4)
    }
  })
})
