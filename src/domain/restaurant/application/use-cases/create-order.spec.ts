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

    const { order } = await sut.execute({
      userId: '',
      dishes: [dish],
      paymentMethod: 'pix',
      total: 1200,
    })

    expect(order.id).toBeTruthy()
    expect(order.deliveredIn).toEqual(undefined)
    expect(order.paymentStatus).toEqual('pending')
    expect(order.orderStatus).toEqual('pending')
  })
})
