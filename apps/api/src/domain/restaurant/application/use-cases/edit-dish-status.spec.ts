import { EditDishStatusUseCase } from './edit-dish-status'
import { InMemoryOrderRepository } from 'test/repositories/in-memory-order-repository'
import { makeOrder } from 'test/factories/make-order'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

import { makeOrderItem } from 'test/factories/make-order-item'
import { InMemoryOrderItemsRepository } from 'test/repositories/in-memory-order-item-repository'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { InMemoryDishRepository } from 'test/repositories/in-memory-dish-repository'
import { InMemoryDishAttachmentsRepository } from 'test/repositories/in-memory-dish-attachments-repository'
import { InMemoryAttachmentsRepository } from 'test/repositories/in-memory-attachments-repository'
import { InMemoryCategoryRepository } from 'test/repositories/in-memory-category-repository'
import { InMemoryDishIngredientsRepository } from 'test/repositories/in-memory-dish-ingredients-repository'
import { InMemoryClientsRepository } from 'test/repositories/in-memory-clients-repository'

let inMemoryClientsRepository: InMemoryClientsRepository
let inMemoryDishIngredientsRepository: InMemoryDishIngredientsRepository
let inMemoryCategoryRepository: InMemoryCategoryRepository
let inMemoryDishRepository: InMemoryDishRepository
let inMemoryDishAttachmentsRepository: InMemoryDishAttachmentsRepository
let inMemoryAttachmentsRepository: InMemoryAttachmentsRepository

let inMemoryOrderRepository: InMemoryOrderRepository
let inMemoryOrderItemsRepository: InMemoryOrderItemsRepository

let sut: EditDishStatusUseCase

describe('Edit dish status', () => {
  beforeEach(() => {
    inMemoryOrderItemsRepository = new InMemoryOrderItemsRepository()
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
    inMemoryClientsRepository = new InMemoryClientsRepository()
    inMemoryOrderRepository = new InMemoryOrderRepository(
      inMemoryOrderItemsRepository,
      inMemoryDishAttachmentsRepository,
      inMemoryAttachmentsRepository,
      inMemoryDishRepository,
      inMemoryClientsRepository,
    )

    sut = new EditDishStatusUseCase(
      inMemoryOrderRepository,
      inMemoryOrderItemsRepository,
    )
  })

  it('should be able to edit a dish status', async () => {
    const newOrder = makeOrder({}, new UniqueEntityID('order-1'))

    await inMemoryOrderRepository.create(newOrder)

    inMemoryOrderItemsRepository.items.push(
      makeOrderItem({
        orderId: newOrder.id,
        dishId: new UniqueEntityID('initial-dish'),
        status: 'PENDING',
      }),
      makeOrderItem({
        orderId: newOrder.id,
        dishId: new UniqueEntityID('edited-dish'),
        status: 'PENDING',
      }),
    )

    const result = await sut.execute({
      orderId: newOrder.id.toString(),
      dishId: 'edited-dish',
      status: 'PREPARING',
    })

    const editedItem = inMemoryOrderItemsRepository.items.find(
      (item) => item.dishId.toString() === 'edited-dish',
    )

    const initialItem = inMemoryOrderItemsRepository.items.find(
      (item) => item.dishId.toString() === 'initial-dish',
    )

    expect(result.isRight()).toBe(true)
    expect(inMemoryOrderRepository.items).toHaveLength(1)
    expect(inMemoryOrderItemsRepository.items).toHaveLength(2)
    expect(editedItem?.status).toBe('PREPARING')
    expect(initialItem?.status).toBe('PENDING')

    expect(newOrder.status).toBe('PREPARING')
  })

  it('should be able to edit a dish status and change the order status to delivered', async () => {
    const newOrder = makeOrder({}, new UniqueEntityID('order-1'))

    await inMemoryOrderRepository.create(newOrder)

    inMemoryOrderItemsRepository.items.push(
      makeOrderItem({
        orderId: newOrder.id,
        dishId: new UniqueEntityID('dish-1'),
        status: 'PENDING',
      }),
      makeOrderItem({
        orderId: newOrder.id,
        dishId: new UniqueEntityID('dish-2'),
        status: 'PENDING',
      }),
    )

    const [result] = await Promise.all([
      sut.execute({
        orderId: newOrder.id.toString(),
        dishId: 'dish-1',
        status: 'DELIVERED',
      }),
      sut.execute({
        orderId: newOrder.id.toString(),
        dishId: 'dish-2',
        status: 'DELIVERED',
      }),
    ])

    const editedItem = inMemoryOrderItemsRepository.items.find(
      (item) => item.dishId.toString() === 'dish-2',
    )

    const initialItem = inMemoryOrderItemsRepository.items.find(
      (item) => item.dishId.toString() === 'dish-1',
    )

    expect(result.isRight()).toBe(true)
    expect(inMemoryOrderRepository.items).toHaveLength(1)
    expect(inMemoryOrderItemsRepository.items).toHaveLength(2)
    expect(editedItem?.status).toBe('DELIVERED')
    expect(initialItem?.status).toBe('DELIVERED')

    expect(newOrder.status).toBe('DELIVERED')
  })

  it('should be able to edit a dish status and change the order status to canceled', async () => {
    const newOrder = makeOrder({}, new UniqueEntityID('order-1'))

    await inMemoryOrderRepository.create(newOrder)

    inMemoryOrderItemsRepository.items.push(
      makeOrderItem({
        orderId: newOrder.id,
        dishId: new UniqueEntityID('dish-1'),
        status: 'PENDING',
      }),
      makeOrderItem({
        orderId: newOrder.id,
        dishId: new UniqueEntityID('dish-2'),
        status: 'PENDING',
      }),
    )

    const [result] = await Promise.all([
      sut.execute({
        orderId: newOrder.id.toString(),
        dishId: 'dish-1',
        status: 'CANCELED',
      }),
      sut.execute({
        orderId: newOrder.id.toString(),
        dishId: 'dish-2',
        status: 'CANCELED',
      }),
    ])

    const editedItem = inMemoryOrderItemsRepository.items.find(
      (item) => item.dishId.toString() === 'dish-2',
    )

    const initialItem = inMemoryOrderItemsRepository.items.find(
      (item) => item.dishId.toString() === 'dish-1',
    )

    expect(result.isRight()).toBe(true)
    expect(inMemoryOrderRepository.items).toHaveLength(1)
    expect(inMemoryOrderItemsRepository.items).toHaveLength(2)
    expect(editedItem?.status).toBe('CANCELED')
    expect(initialItem?.status).toBe('CANCELED')

    expect(newOrder.status).toBe('CANCELED')
  })

  it('should not be able to edit a dish status when the order does not exist', async () => {
    const result = await sut.execute({
      orderId: 'invalid-order-id',
      dishId: 'edited-dish',
      status: 'PREPARING',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
