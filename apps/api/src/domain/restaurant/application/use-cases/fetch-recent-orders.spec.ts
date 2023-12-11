import { InMemoryOrderRepository } from 'test/repositories/in-memory-order-repository'
import { FetchRecentOrderUseCase } from './fetch-recent-orders'
import { InMemoryOrderItemsRepository } from 'test/repositories/in-memory-order-item-repository'
import { makeOrder } from 'test/factories/make-order'
import { makeClient } from 'test/factories/make-client'
import { InMemoryDishIngredientsRepository } from 'test/repositories/in-memory-dish-ingredients-repository'
import { InMemoryCategoryRepository } from 'test/repositories/in-memory-category-repository'
import { InMemoryDishRepository } from 'test/repositories/in-memory-dish-repository'
import { InMemoryDishAttachmentsRepository } from 'test/repositories/in-memory-dish-attachments-repository'
import { InMemoryAttachmentsRepository } from 'test/repositories/in-memory-attachments-repository'

let inMemoryDishIngredientsRepository: InMemoryDishIngredientsRepository
let inMemoryCategoryRepository: InMemoryCategoryRepository
let inMemoryDishRepository: InMemoryDishRepository
let inMemoryDishAttachmentsRepository: InMemoryDishAttachmentsRepository
let inMemoryAttachmentsRepository: InMemoryAttachmentsRepository
let inMemoryOrderItemRepository: InMemoryOrderItemsRepository
let inMemoryOrderRepository: InMemoryOrderRepository

let sut: FetchRecentOrderUseCase

describe('Fetch recent order', () => {
  beforeEach(() => {
    inMemoryOrderItemRepository = new InMemoryOrderItemsRepository()

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

    inMemoryOrderRepository = new InMemoryOrderRepository(
      inMemoryOrderItemRepository,
      inMemoryDishAttachmentsRepository,
      inMemoryAttachmentsRepository,
      inMemoryDishRepository,
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
})
