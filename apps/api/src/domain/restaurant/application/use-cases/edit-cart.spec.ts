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
import { Price } from '../../enterprise/entities/value-objects/price'

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

  it('should be able to add dish to cart', async () => {
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
      dishes: [{ dishId: dish.id.toString(), quantity: 2 }],
    })

    expect(result.isRight()).toBe(true)

    expect(inMemoryCartRepository.items).toHaveLength(1)
    expect(inMemoryCartItemsRepository.items).toHaveLength(1)
  })

  it('should be able edit a dishes in the cart', async () => {
    const cart = makeCart()

    await inMemoryCartRepository.create(cart)

    const dish = makeDish()
    const dish2 = makeDish()
    const dish3 = makeDish()

    await Promise.all([
      inMemoryDishRepository.create(dish),
      inMemoryDishRepository.create(dish2),
      inMemoryDishRepository.create(dish3),
    ])

    inMemoryCartItemsRepository.items.push(
      makeCartItem({
        cartId: cart.id,
        dishId: dish.id,
        quantity: 1,
      }),
      makeCartItem({
        cartId: cart.id,
        dishId: dish2.id,
        quantity: 3,
      }),
      makeCartItem({
        cartId: cart.id,
        dishId: dish3.id,
        quantity: 3,
      }),
    )

    expect(inMemoryCartItemsRepository.items).toHaveLength(3)

    const result = await sut.execute({
      cartId: cart.id.toString(),
      dishes: [
        { dishId: dish.id.toString(), quantity: 1 },
        { dishId: dish2.id.toString(), quantity: 1 },
      ],
    })

    expect(result.isRight()).toBe(true)

    expect(inMemoryCartRepository.items).toHaveLength(1)

    const cartItems = inMemoryCartItemsRepository.items

    expect(cartItems).toHaveLength(2)
    expect(cartItems).toEqual([
      expect.objectContaining({ dishId: dish.id, quantity: 1 }),
      expect.objectContaining({ dishId: dish2.id, quantity: 1 }),
    ])
  })

  it('should be able to calculate total amount and cost', async () => {
    const cart = makeCart()

    await inMemoryCartRepository.create(cart)

    const price = 12.98

    const dish = makeDish({
      price: Price.create(price),
    })

    const dish2 = makeDish({
      price: Price.create(price),
    })

    await Promise.all([
      inMemoryDishRepository.create(dish),
      inMemoryDishRepository.create(dish2),
    ])

    await sut.execute({
      cartId: cart.id.toString(),
      dishes: [
        { dishId: dish.id.toString(), quantity: 1 },
        { dishId: dish2.id.toString(), quantity: 3 },
      ],
    })

    const dishQuantity = 1 + 3
    const totalCartValue = price * dishQuantity

    expect(inMemoryCartItemsRepository.items).toHaveLength(2)
    expect(inMemoryCartRepository.items[0].totalAmount).toEqual(totalCartValue)
  })

  it('should not be able to edit a dish status when the cart does not exist', async () => {
    const result = await sut.execute({
      cartId: 'invalid-cart-id',
      dishes: [{ dishId: 'edited-dish', quantity: 2 }],
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
