import { GetOrderByIdUseCase } from './get-order-by-id'
import { InMemoryOrdersRepository } from 'test/repositories/in-memory-order-repository'
import { InMemoryDishAttachmentsRepository } from 'test/repositories/in-memory-dish-attachments-repository'
import { InMemoryCategoryRepository } from 'test/repositories/in-memory-category-repository'
import { InMemoryAttachmentsRepository } from 'test/repositories/in-memory-attachments-repository'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { InMemoryDishRepository } from 'test/repositories/in-memory-dish-repository'
import { InMemoryDishIngredientsRepository } from 'test/repositories/in-memory-dish-ingredients-repository'
import { makeOrder } from 'test/factories/make-order'
import { InMemoryClientsRepository } from 'test/repositories/in-memory-clients-repository'
import { InMemoryCartRepository } from 'test/repositories/in-memory-cart-repository'
import { InMemoryCartItemsRepository } from 'test/repositories/in-memory-cart-item-repository'
import { InMemoryIngredientsRepository } from 'test/repositories/in-memory-ingredients-repository'
import { CartAbstractFactory } from 'test/factories/cart-abstract-factory'
import { DishAbstractFactory } from 'test/factories/dish-abstract-factory'
import { makeCartItem } from 'test/factories/make-cart-item'

let inMemoryClientsRepository: InMemoryClientsRepository
let inMemoryOrdersRepository: InMemoryOrdersRepository
let inMemoryDishAttachmentsRepository: InMemoryDishAttachmentsRepository
let inMemoryAttachmentsRepository: InMemoryAttachmentsRepository
let inMemoryDishRepository: InMemoryDishRepository
let inMemoryDishIngredientsRepository: InMemoryDishIngredientsRepository
let inMemoryCategoryRepository: InMemoryCategoryRepository
let inMemoryCartRepository: InMemoryCartRepository
let inMemoryCartItemsRepository: InMemoryCartItemsRepository
let inMemoryIngredientsRepository: InMemoryIngredientsRepository

let dishFactory: DishAbstractFactory
let cartFactory: CartAbstractFactory
let sut: GetOrderByIdUseCase

describe('Get Order By Id', () => {
  beforeEach(() => {
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

    inMemoryIngredientsRepository = new InMemoryIngredientsRepository()

    inMemoryClientsRepository = new InMemoryClientsRepository()

    inMemoryCartItemsRepository = new InMemoryCartItemsRepository()

    inMemoryCartRepository = new InMemoryCartRepository(
      inMemoryCartItemsRepository,
      inMemoryDishAttachmentsRepository,
      inMemoryAttachmentsRepository,
      inMemoryDishRepository,
      inMemoryClientsRepository,
    )

    inMemoryOrdersRepository = new InMemoryOrdersRepository(
      inMemoryDishAttachmentsRepository,
      inMemoryAttachmentsRepository,
      inMemoryDishRepository,
      inMemoryCartRepository,
      inMemoryCartItemsRepository,
      inMemoryDishIngredientsRepository,
    )

    cartFactory = new CartAbstractFactory(
      inMemoryCartRepository,
      inMemoryCartItemsRepository,
      inMemoryDishRepository,
      inMemoryClientsRepository,
    )

    dishFactory = new DishAbstractFactory(
      inMemoryDishRepository,
      inMemoryCategoryRepository,
      inMemoryAttachmentsRepository,
      inMemoryDishAttachmentsRepository,
      inMemoryIngredientsRepository,
      inMemoryDishIngredientsRepository,
    )

    sut = new GetOrderByIdUseCase(inMemoryOrdersRepository)
  })

  it('should be able to get a order by id', async () => {
    const { cart, client } = cartFactory.createCart()
    const { dish, ingredients, attachments } = dishFactory.createCompletedDish()

    inMemoryCartItemsRepository.items.push(
      makeCartItem({
        cartId: cart.id,
        dishId: dish.id,
        quantity: 1,
      }),
    )

    const order = makeOrder({
      clientId: client.id,
      cartId: cart.id,
    })

    inMemoryOrdersRepository.items.push(order)

    const result = await sut.execute({
      orderId: order.id.toString(),
    })

    expect(result.isRight()).toBe(true)

    expect(result.value).toEqual({
      order: expect.objectContaining({
        clientId: client.id,
        orderId: order.id,
        code: order.code,
        currency: order.currency,
        amountTotal: order.amountTotal,
        paymentMethod: order.paymentMethod,
        paymentStatus: order.paymentStatus,
        status: order.status,
        priority: order.priority,
        label: order.label,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
        cart: expect.objectContaining({
          totalAmount: cart.totalAmount,
          createdAt: cart.createdAt,
          updatedAt: cart.updatedAt,
          cartItems: expect.arrayContaining([
            expect.objectContaining({
              id: dish.id.toString(),
              name: dish.name,
              description: dish.description,
              price: dish.price,
              slug: dish.slug.value,
              quantity: expect.any(Number),
              ingredients: expect.arrayContaining(
                ingredients.map((ingredient) => ingredient.name),
              ),
              attachments: expect.arrayContaining(
                attachments.map((attachment) => ({
                  id: attachment.id.toString(),
                  title: attachment.title,
                  url: attachment.url,
                })),
              ),
            }),
          ]),
        }),
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
