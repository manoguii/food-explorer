import { GetOrderByIdUseCase } from './get-order-by-id'
import { InMemoryOrderRepository } from 'test/repositories/in-memory-order-repository'
import { InMemoryDishAttachmentsRepository } from 'test/repositories/in-memory-dish-attachments-repository'
import { InMemoryCategoryRepository } from 'test/repositories/in-memory-category-repository'
import { makeCategory } from 'test/factories/make-category'
import { InMemoryAttachmentsRepository } from 'test/repositories/in-memory-attachments-repository'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { InMemoryDishRepository } from 'test/repositories/in-memory-dish-repository'
import { InMemoryDishIngredientsRepository } from 'test/repositories/in-memory-dish-ingredients-repository'
import { InMemoryOrderItemsRepository } from 'test/repositories/in-memory-order-item-repository'
import { makeDish } from 'test/factories/make-dish'
import { Slug } from '../../enterprise/entities/value-objects/slug'
import { makeOrder } from 'test/factories/make-order'
import { makeOrderItem } from 'test/factories/make-order-item'
import { makeDishAttachment } from 'test/factories/make-dish-attachment'
import { makeAttachment } from 'test/factories/make-attachment'

let inMemoryOrderRepository: InMemoryOrderRepository
let inMemoryOrderItemsRepository: InMemoryOrderItemsRepository
let inMemoryDishAttachmentsRepository: InMemoryDishAttachmentsRepository
let inMemoryAttachmentsRepository: InMemoryAttachmentsRepository
let inMemoryDishRepository: InMemoryDishRepository
let inMemoryDishIngredientsRepository: InMemoryDishIngredientsRepository
let inMemoryCategoryRepository: InMemoryCategoryRepository
let sut: GetOrderByIdUseCase

describe('Get Order By Id', () => {
  beforeEach(() => {
    inMemoryOrderItemsRepository = new InMemoryOrderItemsRepository()
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
    inMemoryOrderRepository = new InMemoryOrderRepository(
      inMemoryOrderItemsRepository,
      inMemoryDishAttachmentsRepository,
      inMemoryAttachmentsRepository,
      inMemoryDishRepository,
    )

    sut = new GetOrderByIdUseCase(inMemoryOrderRepository)
  })

  it('should be able to get a order by id', async () => {
    const category = makeCategory()

    await inMemoryCategoryRepository.create(category)

    const dish = makeDish({
      slug: Slug.create('example-dish'),
      categoryId: category.id,
    })

    await inMemoryDishRepository.create(dish)

    const attachment = makeAttachment()
    const attachment2 = makeAttachment()
    inMemoryAttachmentsRepository.items.push(attachment, attachment2)

    await inMemoryDishAttachmentsRepository.createMany([
      makeDishAttachment({
        dishId: dish.id,
        attachmentId: attachment.id,
      }),
      makeDishAttachment({
        dishId: dish.id,
        attachmentId: attachment2.id,
      }),
    ])

    const order = makeOrder()

    await inMemoryOrderRepository.create(order)

    const orderItem = makeOrderItem({
      orderId: order.id,
      dishId: dish.id,
      quantity: 1,
    })

    inMemoryOrderItemsRepository.items.push(orderItem)

    const result = await sut.execute({
      orderId: order.id.toString(),
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toMatchObject({
      order: expect.objectContaining({
        orderId: order.id,
        status: order.status,
        code: order.code.value,
        dishes: expect.arrayContaining([
          expect.objectContaining({
            id: dish.id.toString(),
            name: dish.name,
            price: dish.price,
            attachments: expect.arrayContaining([
              expect.objectContaining({
                id: attachment.id.toString(),
                url: attachment.url,
              }),
              expect.objectContaining({
                id: attachment2.id.toString(),
                url: attachment2.url,
              }),
            ]),
            quantity: 1,
          }),
        ]),
      }),
    })
  })

  it('should not be able to get a order by id if order does not exists', async () => {
    const result = await sut.execute({
      orderId: 'invalid-order-id',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toEqual(new ResourceNotFoundError())
  })
})
