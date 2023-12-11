import { EditOrderUseCase } from './edit-order-dishes'
import { InMemoryOrderRepository } from 'test/repositories/in-memory-order-repository'
import { makeOrder } from 'test/factories/make-order'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

import { makeOrderItem } from 'test/factories/make-order-item'
import { InMemoryOrderItemsRepository } from 'test/repositories/in-memory-order-item-repository'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { InMemoryDishRepository } from 'test/repositories/in-memory-dish-repository'
import { InMemoryDishAttachmentsRepository } from 'test/repositories/in-memory-dish-attachments-repository'
import { InMemoryDishIngredientsRepository } from 'test/repositories/in-memory-dish-ingredients-repository'
import { InMemoryCategoryRepository } from 'test/repositories/in-memory-category-repository'
import { InMemoryAttachmentsRepository } from 'test/repositories/in-memory-attachments-repository'
import { makeDish } from 'test/factories/make-dish'

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
    inMemoryDishRepository = new InMemoryDishRepository(
      inMemoryDishAttachmentsRepository,
      inMemoryDishIngredientsRepository,
      inMemoryCategoryRepository,
      inMemoryAttachmentsRepository,
    )
    inMemoryOrderItemsRepository = new InMemoryOrderItemsRepository()
    inMemoryOrderRepository = new InMemoryOrderRepository(
      inMemoryOrderItemsRepository,
      inMemoryDishAttachmentsRepository,
      inMemoryAttachmentsRepository,
      inMemoryDishRepository,
    )

    sut = new EditOrderUseCase(
      inMemoryOrderRepository,
      inMemoryOrderItemsRepository,
      inMemoryDishRepository,
    )
  })

  it('should be able to edit a order', async () => {
    const newOrder = makeOrder(
      {
        clientId: new UniqueEntityID('client-1'),
      },
      new UniqueEntityID('order-1'),
    )

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

    const newDish = makeDish({
      name: 'Chá de Canela',
    })

    inMemoryDishRepository.items.push(newDish)

    const newItems = [
      {
        dishId: dish.id.toString(),
        quantity: 5,
      },
      {
        dishId: newDish.id.toString(),
        quantity: 3,
      },
    ]

    const result = await sut.execute({
      orderId: newOrder.id.toString(),
      dishes: newItems,
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryOrderRepository.items[0].items.currentItems).toHaveLength(2)
    expect(inMemoryOrderRepository.items[0].orderDetails).toEqual(
      '5 x Salada Radish, 3 x Chá de Canela',
    )
    expect(inMemoryOrderRepository.items[0].items.currentItems).toEqual([
      expect.objectContaining({
        dishId: dish.id,
        quantity: 5,
      }),
      expect.objectContaining({
        dishId: newDish.id,
        quantity: 3,
      }),
    ])
  })

  it('should not be able to edit a order when it does not exist', async () => {
    const result = await sut.execute({
      orderId: 'invalid-order-id',
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

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
