import { makeDish } from '@/test/factories/make-dish'
import { CreateOrderUseCase } from './create-order'
import { InMemoryOrderRepository } from '@/test/repository/in-memory/in-memory-order-repository'

let inMemoryOrderRepository: InMemoryOrderRepository
let sut: CreateOrderUseCase

describe('Create Order', () => {
  beforeEach(() => {
    inMemoryOrderRepository = new InMemoryOrderRepository()
    sut = new CreateOrderUseCase(inMemoryOrderRepository)
  })

  it('should be able to create a new order', async () => {
    const dish = makeDish()

    const result = await sut.execute({
      userId: '',
      dishes: [dish],
      paymentMethod: 'pix',
      total: 1200,
    })

    expect(result.isRight()).toBe(true)
    expect(result.value?.order.id).toBeTruthy()
    expect(result.value?.order.deliveredIn).toEqual(undefined)
    expect(result.value?.order.paymentStatus).toEqual('pending')
    expect(result.value?.order.orderStatus).toEqual('pending')
  })
})
