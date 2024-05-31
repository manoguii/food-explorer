import { CartAbstractFactory } from 'test/factories/cart-abstract-factory'
import { DishAbstractFactory } from 'test/factories/dish-abstract-factory'
import { makeCartItem } from 'test/factories/make-cart-item'
import { makeClient } from 'test/factories/make-client'
import { makeOrder } from 'test/factories/make-order'
import { InMemoryAttachmentsRepository } from 'test/repositories/in-memory-attachments-repository'
import { InMemoryCartItemsRepository } from 'test/repositories/in-memory-cart-item-repository'
import { InMemoryCartRepository } from 'test/repositories/in-memory-cart-repository'
import { InMemoryCategoryRepository } from 'test/repositories/in-memory-category-repository'
import { InMemoryClientsRepository } from 'test/repositories/in-memory-clients-repository'
import { InMemoryDishAttachmentsRepository } from 'test/repositories/in-memory-dish-attachments-repository'
import { InMemoryDishIngredientsRepository } from 'test/repositories/in-memory-dish-ingredients-repository'
import { InMemoryDishRepository } from 'test/repositories/in-memory-dish-repository'
import { InMemoryIngredientsRepository } from 'test/repositories/in-memory-ingredients-repository'
import { InMemoryOrdersRepository } from 'test/repositories/in-memory-order-repository'

import { FetchAllOrdersUseCase } from './fetch-all-orders'

let inMemoryClientsRepository: InMemoryClientsRepository
let inMemoryDishIngredientsRepository: InMemoryDishIngredientsRepository
let inMemoryCategoryRepository: InMemoryCategoryRepository
let inMemoryDishRepository: InMemoryDishRepository
let inMemoryDishAttachmentsRepository: InMemoryDishAttachmentsRepository
let inMemoryAttachmentsRepository: InMemoryAttachmentsRepository
let inMemoryOrdersRepository: InMemoryOrdersRepository
let inMemoryCartRepository: InMemoryCartRepository
let inMemoryCartItemsRepository: InMemoryCartItemsRepository
let inMemoryIngredientsRepository: InMemoryIngredientsRepository

let dishFactory: DishAbstractFactory
let cartFactory: CartAbstractFactory
let sut: FetchAllOrdersUseCase

describe('Fetch orders', () => {
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

    inMemoryClientsRepository = new InMemoryClientsRepository()

    inMemoryCartItemsRepository = new InMemoryCartItemsRepository()

    inMemoryCartRepository = new InMemoryCartRepository(
      inMemoryCartItemsRepository,
      inMemoryDishAttachmentsRepository,
      inMemoryAttachmentsRepository,
      inMemoryDishRepository,
      inMemoryClientsRepository,
    )

    inMemoryIngredientsRepository = new InMemoryIngredientsRepository()

    inMemoryOrdersRepository = new InMemoryOrdersRepository(
      inMemoryDishAttachmentsRepository,
      inMemoryAttachmentsRepository,
      inMemoryDishRepository,
      inMemoryCartRepository,
      inMemoryCartItemsRepository,
      inMemoryDishIngredientsRepository,
      inMemoryClientsRepository,
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

    sut = new FetchAllOrdersUseCase(
      inMemoryOrdersRepository,
      inMemoryClientsRepository,
    )
  })

  it('should be able to fetch all orders', async () => {
    const AdminUser = makeClient({
      role: 'ADMIN',
    })

    inMemoryClientsRepository.items.push(AdminUser)

    const { cart, client } = cartFactory.createCartWithItems()
    const { cart: OTHER_CART, client: OTHER_CLIENT } =
      cartFactory.createCartWithItems()

    inMemoryOrdersRepository.items.push(
      makeOrder({
        clientId: client.id,
        cartId: cart.id,
      }),
      makeOrder({
        clientId: client.id,
        cartId: cart.id,
      }),
      makeOrder({
        clientId: OTHER_CLIENT.id,
        cartId: OTHER_CART.id,
      }),
    )

    const result = await sut.execute({
      clientId: AdminUser.id.toString(),
      page: 1,
    })

    expect(result.isRight()).toBe(true)

    if (result.isRight()) {
      expect(result.value?.orders).toHaveLength(3)
      expect(result.value?.orders).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            clientId: client.id,
          }),
          expect.objectContaining({
            clientId: client.id,
          }),
          expect.objectContaining({
            clientId: OTHER_CLIENT.id,
          }),
        ]),
      )
    }
  })

  it('should be able to fetch all orders with details', async () => {
    const AdminUser = makeClient({
      role: 'ADMIN',
    })

    inMemoryClientsRepository.items.push(AdminUser)

    const { dish, ingredients, attachments } = dishFactory.createCompletedDish()
    const { cart, client } = cartFactory.createCart()

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
      clientId: AdminUser.id.toString(),
      page: 1,
    })

    expect(result.isRight()).toBe(true)

    if (result.isRight()) {
      expect(result.value.orders).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
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
        ]),
      )
    }
  })

  it('should be able to fetch all paginated orders', async () => {
    const AdminUser = makeClient({
      role: 'ADMIN',
    })

    inMemoryClientsRepository.items.push(AdminUser)

    const { cart, client } = cartFactory.createCartWithItems()

    for (let i = 1; i <= 22; i++) {
      inMemoryOrdersRepository.items.push(
        makeOrder({
          clientId: client.id,
          cartId: cart.id,
        }),
      )
    }

    const result = await sut.execute({
      clientId: AdminUser.id.toString(),
      page: 3,
    })

    expect(result.isRight()).toBe(true)

    if (result.isRight()) {
      expect(result.value?.orders).toHaveLength(2)
    }
  })
})
