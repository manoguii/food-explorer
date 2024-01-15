import { EditCartUseCase } from './edit-cart'
import { InMemoryCartRepository } from 'test/repositories/in-memory-cart-repository'
import { makeCart } from 'test/factories/make-cart'
import { makeCartItem } from 'test/factories/make-cart-item'
import { InMemoryCartItemsRepository } from 'test/repositories/in-memory-cart-item-repository'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { InMemoryDishRepository } from 'test/repositories/in-memory-dish-repository'
import { InMemoryDishAttachmentsRepository } from 'test/repositories/in-memory-dish-attachments-repository'
import { InMemoryAttachmentsRepository } from 'test/repositories/in-memory-attachments-repository'
import { InMemoryCategoryRepository } from 'test/repositories/in-memory-category-repository'
import { InMemoryDishIngredientsRepository } from 'test/repositories/in-memory-dish-ingredients-repository'
import { InMemoryClientsRepository } from 'test/repositories/in-memory-clients-repository'
import { makeDish } from 'test/factories/make-dish'

let inMemoryClientsRepository: InMemoryClientsRepository
let inMemoryDishIngredientsRepository: InMemoryDishIngredientsRepository
let inMemoryCategoryRepository: InMemoryCategoryRepository
let inMemoryDishRepository: InMemoryDishRepository
let inMemoryDishAttachmentsRepository: InMemoryDishAttachmentsRepository
let inMemoryAttachmentsRepository: InMemoryAttachmentsRepository

let inMemoryCartRepository: InMemoryCartRepository
let inMemoryCartItemsRepository: InMemoryCartItemsRepository

let sut: EditCartUseCase

describe('Edit dish status', () => {
  beforeEach(() => {
    inMemoryCartItemsRepository = new InMemoryCartItemsRepository()
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
    inMemoryCartRepository = new InMemoryCartRepository(
      inMemoryCartItemsRepository,
      inMemoryDishAttachmentsRepository,
      inMemoryAttachmentsRepository,
      inMemoryDishRepository,
      inMemoryClientsRepository,
    )

    sut = new EditCartUseCase(
      inMemoryCartRepository,
      inMemoryCartItemsRepository,
      inMemoryDishRepository,
    )
  })

  it('should be able to update dish quantity in the cart', async () => {
    const cart = makeCart()

    await inMemoryCartRepository.create(cart)

    const dish = makeDish()

    await inMemoryDishRepository.create(dish)

    inMemoryCartItemsRepository.items.push(
      makeCartItem({
        cartId: cart.id,
        dishId: dish.id,
        quantity: 1,
      }),
    )

    const result = await sut.execute({
      cartId: cart.id.toString(),
      dish: { dishId: dish.id.toString(), quantity: 10 },
    })

    expect(result.isRight()).toBe(true)

    const cartItemsOnDb = inMemoryCartItemsRepository.items
    const cartsOnDb = inMemoryCartRepository.items

    expect(cartsOnDb).toHaveLength(1)
    expect(cartItemsOnDb).toHaveLength(1)

    expect(cartItemsOnDb[0].quantity).toBe(10)

    expect(cartItemsOnDb[0].cost).toBe(dish.price * 10)
    expect(cartsOnDb[0].totalAmount).toBe(dish.price * 10)
  })

  it('should not be able to edit a dish quantity when the cart does not exist', async () => {
    const result = await sut.execute({
      cartId: 'invalid-cart-id',
      dish: { dishId: 'edited-dish', quantity: 2 },
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
