import { CreateOrderUseCase } from './create-order'
import { InMemoryOrderRepository } from 'test/repositories/in-memory-order-repository'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { InMemoryOrderItemsRepository } from 'test/repositories/in-memory-order-item-repository'
import { InvalidOrderError } from './errors/invalid-order-error'
import { InMemoryDishRepository } from 'test/repositories/in-memory-dish-repository'
import { InMemoryDishAttachmentsRepository } from 'test/repositories/in-memory-dish-attachments-repository'
import { InMemoryDishIngredientsRepository } from 'test/repositories/in-memory-dish-ingredients-repository'
import { InMemoryCategoryRepository } from 'test/repositories/in-memory-category-repository'
import { InMemoryAttachmentsRepository } from 'test/repositories/in-memory-attachments-repository'
import { makeDish } from 'test/factories/make-dish'
import { makeClient } from 'test/factories/make-client'

let inMemoryDishRepository: InMemoryDishRepository
let inMemoryDishAttachmentsRepository: InMemoryDishAttachmentsRepository
let inMemoryDishIngredientsRepository: InMemoryDishIngredientsRepository
let inMemoryCategoryRepository: InMemoryCategoryRepository
let inMemoryAttachmentsRepository: InMemoryAttachmentsRepository
let inMemoryOrderRepository: InMemoryOrderRepository
let inMemoryOrderItemsRepository: InMemoryOrderItemsRepository
let sut: CreateOrderUseCase

describe('Create Order', () => {
  beforeEach(() => {
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
    inMemoryOrderItemsRepository = new InMemoryOrderItemsRepository()
    inMemoryOrderRepository = new InMemoryOrderRepository(
      inMemoryOrderItemsRepository,
    )
    sut = new CreateOrderUseCase(
      inMemoryOrderRepository,
      inMemoryDishRepository,
    )
  })

  it('should be able to create a order', async () => {
    const client = makeClient()
    const dish = makeDish({}, new UniqueEntityID('10'))
    const dish2 = makeDish({}, new UniqueEntityID('20'))

    await inMemoryDishRepository.create(dish)
    await inMemoryDishRepository.create(dish2)

    const result = await sut.execute({
      clientId: client.id.toString(),
      dishes: [
        { dishId: dish.id.toString(), quantity: 1 },
        { dishId: dish2.id.toString(), quantity: 2 },
      ],
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryOrderRepository.items[0].items.currentItems).toHaveLength(2)
    expect(inMemoryOrderRepository.items[0].items.currentItems).toEqual([
      expect.objectContaining({ dishId: new UniqueEntityID('10') }),
      expect.objectContaining({ dishId: new UniqueEntityID('20') }),
    ])
  })

  it('should not be able to create a order with no items', async () => {
    const client = makeClient()
    const result = await sut.execute({
      clientId: client.id.toString(),
      dishes: [],
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(InvalidOrderError)
  })

  it('should not be able to create a order with invalid dish', async () => {
    const client = makeClient()
    const result = await sut.execute({
      clientId: client.id.toString(),
      dishes: [{ dishId: '10', quantity: 1 }],
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(InvalidOrderError)
  })
})
