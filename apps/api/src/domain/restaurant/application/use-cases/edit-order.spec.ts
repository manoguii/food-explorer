import { EditOrderUseCase } from './edit-order'
import { InMemoryOrderRepository } from 'test/repositories/in-memory-order-repository'
import { makeOrder } from 'test/factories/make-order'

import { makeOrderItem } from 'test/factories/make-order-item'
import { InMemoryOrderItemsRepository } from 'test/repositories/in-memory-order-item-repository'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { InMemoryDishRepository } from 'test/repositories/in-memory-dish-repository'
import { InMemoryDishAttachmentsRepository } from 'test/repositories/in-memory-dish-attachments-repository'
import { InMemoryDishIngredientsRepository } from 'test/repositories/in-memory-dish-ingredients-repository'
import { InMemoryCategoryRepository } from 'test/repositories/in-memory-category-repository'
import { InMemoryAttachmentsRepository } from 'test/repositories/in-memory-attachments-repository'
import { makeDish } from 'test/factories/make-dish'
import { InMemoryClientsRepository } from 'test/repositories/in-memory-clients-repository'

let inMemoryClientsRepository: InMemoryClientsRepository
let inMemoryDishRepository: InMemoryDishRepository
let inMemoryDishAttachmentsRepository: InMemoryDishAttachmentsRepository
let inMemoryDishIngredientsRepository: InMemoryDishIngredientsRepository
let inMemoryCategoryRepository: InMemoryCategoryRepository
let inMemoryAttachmentsRepository: InMemoryAttachmentsRepository
let inMemoryOrderRepository: InMemoryOrderRepository
let inMemoryOrderItemsRepository: InMemoryOrderItemsRepository

let sut: EditOrderUseCase

describe('Edit Order', () => {
  beforeEach(() => {
    inMemoryDishAttachmentsRepository = new InMemoryDishAttachmentsRepository()
    inMemoryAttachmentsRepository = new InMemoryAttachmentsRepository()
    inMemoryDishIngredientsRepository = new InMemoryDishIngredientsRepository()
    inMemoryCategoryRepository = new InMemoryCategoryRepository()

    inMemoryDishRepository = new InMemoryDishRepository(
      inMemoryDishAttachmentsRepository,
      inMemoryDishIngredientsRepository,
      inMemoryCategoryRepository,
      inMemoryAttachmentsRepository,
    )

    inMemoryOrderItemsRepository = new InMemoryOrderItemsRepository()
    inMemoryClientsRepository = new InMemoryClientsRepository()
    inMemoryOrderRepository = new InMemoryOrderRepository(
      inMemoryOrderItemsRepository,
      inMemoryDishAttachmentsRepository,
      inMemoryAttachmentsRepository,
      inMemoryDishRepository,
      inMemoryClientsRepository,
    )

    sut = new EditOrderUseCase(inMemoryOrderRepository)
  })

  it('should be able to edit a order', async () => {
    const newOrder = makeOrder({
      priority: 'LOW',
      label: 'TABLE',
    })

    await inMemoryOrderRepository.create(newOrder)

    const dish = makeDish({
      name: 'Salada Radish',
    })

    const dish2 = makeDish({
      name: 'Torradas de Parma',
    })

    inMemoryDishRepository.items.push(dish, dish2)

    inMemoryOrderItemsRepository.items.push(
      makeOrderItem({
        orderId: newOrder.id,
        dishId: dish.id,
        quantity: 5,
      }),
      makeOrderItem({
        orderId: newOrder.id,
        dishId: dish2.id,
        quantity: 2,
      }),
    )

    const result = await sut.execute({
      orderId: newOrder.id.toString(),
      priority: 'HIGH',
    })

    expect(result.isRight()).toBe(true)

    expect(inMemoryOrderRepository.items[0]).toEqual(
      expect.objectContaining({
        label: 'TABLE',
        priority: 'HIGH',
      }),
    )
  })

  it('should not be able to edit a order when it does not exist', async () => {
    const result = await sut.execute({
      orderId: 'invalid-order-id',
      label: 'DELIVERY',
      priority: 'HIGH',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
