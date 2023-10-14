import { CreateOrderUseCase } from './create-order'
import { InMemoryOrderRepository } from 'test/repositories/in-memory-order-repository'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

let inMemoryOrderRepository: InMemoryOrderRepository
let sut: CreateOrderUseCase

describe('Create Order', () => {
  beforeEach(() => {
    inMemoryOrderRepository = new InMemoryOrderRepository()
    sut = new CreateOrderUseCase(inMemoryOrderRepository)
  })

  it('should be able to create a order', async () => {
    const result = await sut.execute({
      dishes: [
        { dishId: '10', quantity: '1' },
        { dishId: '20', quantity: '2' },
      ],
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryOrderRepository.items[0]).toEqual(result.value?.order)
    expect(inMemoryOrderRepository.items[0].items.currentItems).toHaveLength(2)
    expect(inMemoryOrderRepository.items[0].items.currentItems).toEqual([
      expect.objectContaining({ dishId: new UniqueEntityID('10') }),
      expect.objectContaining({ dishId: new UniqueEntityID('20') }),
    ])
  })
})
