import { EditOrderUseCase } from './edit-order-dishes'
import { InMemoryOrderRepository } from 'test/repositories/in-memory-order-repository'
import { makeOrder } from 'test/factories/make-order'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

import { makeOrderItem } from 'test/factories/make-order-item'
import { InMemoryOrderItemsRepository } from 'test/repositories/in-memory-order-item-repository'

let inMemoryOrderRepository: InMemoryOrderRepository
let inMemoryOrderItemsRepository: InMemoryOrderItemsRepository

let sut: EditOrderUseCase

describe('Edit Order', () => {
  beforeEach(() => {
    inMemoryOrderItemsRepository = new InMemoryOrderItemsRepository()
    inMemoryOrderRepository = new InMemoryOrderRepository(
      inMemoryOrderItemsRepository,
    )

    sut = new EditOrderUseCase(
      inMemoryOrderRepository,
      inMemoryOrderItemsRepository,
    )
  })

  it('should be able to edit a order', async () => {
    const newOrder = makeOrder({}, new UniqueEntityID('order-1'))

    await inMemoryOrderRepository.create(newOrder)

    inMemoryOrderItemsRepository.items.push(
      makeOrderItem({
        orderId: newOrder.id,
        dishId: new UniqueEntityID('dish-1'),
      }),
      makeOrderItem({
        orderId: newOrder.id,
        dishId: new UniqueEntityID('dish-2'),
      }),
    )

    const result = await sut.execute({
      orderId: newOrder.id.toString(),
      dishes: [
        {
          dishId: 'new-dish-10',
          quantity: 1,
        },
        {
          dishId: 'new-dish-20',
          quantity: 3,
        },
      ],
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryOrderRepository.items[0].items.currentItems).toHaveLength(2)
    expect(inMemoryOrderRepository.items[0].items.currentItems).toEqual([
      expect.objectContaining({
        dishId: new UniqueEntityID('new-dish-10'),
      }),
      expect.objectContaining({
        dishId: new UniqueEntityID('new-dish-20'),
      }),
    ])
  })
})
