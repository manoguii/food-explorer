import { InMemoryOrderRepository } from 'test/repositories/in-memory-order-repository'
import { FetchRecentOrderUseCase } from './fetch-recent-orders'
import { InMemoryOrderItemsRepository } from 'test/repositories/in-memory-order-item-repository'
import { makeOrder } from 'test/factories/make-order'
import { makeClient } from 'test/factories/make-client'

let inMemoryOrderItemRepository: InMemoryOrderItemsRepository
let inMemoryOrderRepository: InMemoryOrderRepository

let sut: FetchRecentOrderUseCase

describe('Fetch recent order', () => {
  beforeEach(() => {
    inMemoryOrderItemRepository = new InMemoryOrderItemsRepository()
    inMemoryOrderRepository = new InMemoryOrderRepository(
      inMemoryOrderItemRepository,
    )
    sut = new FetchRecentOrderUseCase(inMemoryOrderRepository)
  })

  it('should be able to fetch recent orders', async () => {
    const client = makeClient()

    const client2 = makeClient()

    await Promise.all([
      inMemoryOrderRepository.create(
        makeOrder({
          clientId: client.id,
        }),
      ),
      inMemoryOrderRepository.create(
        makeOrder({
          clientId: client.id,
        }),
      ),
      inMemoryOrderRepository.create(
        makeOrder({
          clientId: client2.id,
        }),
      ),
    ])

    const result = await sut.execute({
      page: 1,
      clientId: client.id.toString(),
    })

    expect(result.value?.order).toHaveLength(2)
    expect(result.value?.order).toEqual([
      expect.objectContaining({
        clientId: client.id,
      }),
      expect.objectContaining({
        clientId: client.id,
      }),
    ])
  })

  it('should be able to fetch paginated recent order', async () => {
    const client = makeClient()

    for (let i = 1; i <= 22; i++) {
      await inMemoryOrderRepository.create(
        makeOrder({
          clientId: client.id,
        }),
      )
    }

    const result = await sut.execute({
      page: 3,
      clientId: client.id.toString(),
    })

    expect(result.value?.order).toHaveLength(2)
  })
})
