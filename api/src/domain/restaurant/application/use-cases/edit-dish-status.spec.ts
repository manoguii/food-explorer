import { EditDishStatusUseCase } from './edit-dish-status'
import { InMemoryOrderRepository } from 'test/repositories/in-memory-order-repository'
import { makeOrder } from 'test/factories/make-order'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

import { makeOrderItem } from 'test/factories/make-order-item'
import { InMemoryOrderItemsRepository } from 'test/repositories/in-memory-order-item-repository'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'

let inMemoryOrderRepository: InMemoryOrderRepository
let inMemoryOrderItemsRepository: InMemoryOrderItemsRepository

let sut: EditDishStatusUseCase

describe('Edit dish status', () => {
  beforeEach(() => {
    inMemoryOrderItemsRepository = new InMemoryOrderItemsRepository()
    inMemoryOrderRepository = new InMemoryOrderRepository(
      inMemoryOrderItemsRepository,
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
      }),
      makeOrderItem({
        orderId: newOrder.id,
        dishId: new UniqueEntityID('edited-dish'),
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
