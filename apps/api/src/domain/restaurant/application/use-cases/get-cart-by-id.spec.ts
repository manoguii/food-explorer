import { GetCartByIdUseCase } from './get-cart-by-id'
import { InMemoryCartRepository } from 'test/repositories/in-memory-cart-repository'
import { InMemoryDishAttachmentsRepository } from 'test/repositories/in-memory-dish-attachments-repository'
import { InMemoryCategoryRepository } from 'test/repositories/in-memory-category-repository'
import { InMemoryAttachmentsRepository } from 'test/repositories/in-memory-attachments-repository'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { InMemoryDishRepository } from 'test/repositories/in-memory-dish-repository'
import { InMemoryDishIngredientsRepository } from 'test/repositories/in-memory-dish-ingredients-repository'
import { InMemoryCartItemsRepository } from 'test/repositories/in-memory-cart-item-repository'
import { makeDish } from 'test/factories/make-dish'
import { makeCart } from 'test/factories/make-cart'
import { makeCartItem } from 'test/factories/make-cart-item'
import { makeDishAttachment } from 'test/factories/make-dish-attachment'
import { makeAttachment } from 'test/factories/make-attachment'
import { InMemoryClientsRepository } from 'test/repositories/in-memory-clients-repository'
import { makeClient } from 'test/factories/make-client'

let inMemoryClientsRepository: InMemoryClientsRepository
let inMemoryCartRepository: InMemoryCartRepository
let inMemoryCartItemsRepository: InMemoryCartItemsRepository
let inMemoryDishAttachmentsRepository: InMemoryDishAttachmentsRepository
let inMemoryAttachmentsRepository: InMemoryAttachmentsRepository
let inMemoryDishRepository: InMemoryDishRepository
let inMemoryDishIngredientsRepository: InMemoryDishIngredientsRepository
let inMemoryCategoryRepository: InMemoryCategoryRepository
let sut: GetCartByIdUseCase

describe('Get Cart By Id', () => {
  beforeEach(() => {
    inMemoryCartItemsRepository = new InMemoryCartItemsRepository()
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

    inMemoryClientsRepository = new InMemoryClientsRepository()

    inMemoryCartRepository = new InMemoryCartRepository(
      inMemoryCartItemsRepository,
      inMemoryDishAttachmentsRepository,
      inMemoryAttachmentsRepository,
      inMemoryDishRepository,
      inMemoryClientsRepository,
    )

    sut = new GetCartByIdUseCase(inMemoryCartRepository)
  })

  it('should be able to get a cart by id', async () => {
    const client = makeClient()

    await inMemoryClientsRepository.create(client)

    const newCart = makeCart({
      clientId: client.id,
    })

    await inMemoryCartRepository.create(newCart)

    const [batata, salada] = await Promise.all([makeDish(), makeDish()])

    const [attachment1, attachment2] = await Promise.all([
      makeAttachment(),
      makeAttachment(),
    ])

    await Promise.all([
      inMemoryAttachmentsRepository.create(attachment1),
      inMemoryAttachmentsRepository.create(attachment2),
    ])

    inMemoryDishAttachmentsRepository.items.push(
      makeDishAttachment({
        attachmentId: attachment1.id,
        dishId: batata.id,
      }),
      makeDishAttachment({
        attachmentId: attachment2.id,
        dishId: salada.id,
      }),
    )

    await Promise.all([
      inMemoryDishRepository.create(batata),
      inMemoryDishRepository.create(salada),
    ])

    inMemoryCartItemsRepository.items.push(
      makeCartItem({
        cartId: newCart.id,
        dishId: batata.id,
      }),
      makeCartItem({
        cartId: newCart.id,
        dishId: salada.id,
      }),
    )

    const result = await sut.execute({
      cartId: newCart.id.toString(),
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toMatchObject({
      cart: expect.objectContaining({
        cartId: newCart.id,
        totalAmount: newCart.totalAmount,
        dishes: expect.arrayContaining([
          expect.objectContaining({
            id: batata.id.toString(),
            name: batata.name,
            price: batata.price,
            attachments: [
              expect.objectContaining({
                id: attachment1.id.toString(),
                title: attachment1.title,
                url: attachment1.url,
              }),
            ],
          }),
        ]),
        client: expect.objectContaining({
          id: client.id.toString(),
          name: client.name,
          email: client.email,
        }),
      }),
    })
  })

  it('should not be able to get a cart by id if cart does not exists', async () => {
    const result = await sut.execute({
      cartId: 'invalid-cart-id',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toEqual(new ResourceNotFoundError())
  })
})
