import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { CartFactory } from 'test/factories/make-cart'
import { CartItemFactory } from 'test/factories/make-cart-item'
import { CategoryFactory } from 'test/factories/make-category'
import { ClientFactory } from 'test/factories/make-client'
import { DishFactory } from 'test/factories/make-dish'
import { OrderFactory } from 'test/factories/make-order'

import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'

describe('Fetch orders (E2E)', () => {
  let app: INestApplication
  let jwt: JwtService
  let clientFactory: ClientFactory
  let categoryFactory: CategoryFactory
  let dishFactory: DishFactory
  let orderFactory: OrderFactory
  let cartFactory: CartFactory
  let cartItemFactory: CartItemFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [
        ClientFactory,
        CategoryFactory,
        DishFactory,
        OrderFactory,
        CartFactory,
        CartItemFactory,
      ],
    }).compile()

    app = moduleRef.createNestApplication()

    jwt = moduleRef.get(JwtService)
    clientFactory = moduleRef.get(ClientFactory)
    categoryFactory = moduleRef.get(CategoryFactory)
    dishFactory = moduleRef.get(DishFactory)
    orderFactory = moduleRef.get(OrderFactory)
    cartFactory = moduleRef.get(CartFactory)
    cartItemFactory = moduleRef.get(CartItemFactory)

    await app.init()
  })

  test('[GET] /orders', async () => {
    const user = await clientFactory.makePrismaClient({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    })

    const accessToken = jwt.sign({ sub: user.id.toString() })

    const category = await categoryFactory.makePrismaCategory()

    const [dish, dish2] = await Promise.all([
      dishFactory.makePrismaDish({
        name: 'Batata frita',
        categoryId: category.id,
      }),
      dishFactory.makePrismaDish({
        name: 'Macarrão',
        categoryId: category.id,
      }),
    ])

    const cart = await cartFactory.makePrismaCart({
      clientId: user.id,
    })

    await Promise.all([
      cartItemFactory.makePrismaCartItem({
        cartId: cart.id,
        dishId: dish.id,
        quantity: 2,
      }),
      cartItemFactory.makePrismaCartItem({
        cartId: cart.id,
        dishId: dish2.id,
        quantity: 1,
      }),
    ])

    const order = await orderFactory.makePrismaOrder({
      clientId: user.id,
      cartId: cart.id,
    })

    const response = await request(app.getHttpServer())
      .get('/orders')
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toBe(200)

    expect(response.body.orders).toHaveLength(1)
    expect(response.body).toEqual({
      orders: expect.arrayContaining([
        expect.objectContaining({
          clientId: user.id.toString(),
          orderId: order.id.toString(),
          code: order.code,
          currency: order.currency,
          amountTotal: order.amountTotal,
          paymentMethod: order.paymentMethod,
          paymentStatus: order.paymentStatus,
          status: order.status,
          priority: order.priority,
          label: order.label,
          cart: expect.objectContaining({
            totalAmount: cart.totalAmount,
            cartItems: expect.arrayContaining([
              expect.objectContaining({
                id: dish.id.toString(),
                name: dish.name,
                description: dish.description,
                price: dish.price,
                slug: dish.slug.value,
                quantity: expect.any(Number),
                ingredients: [],
                attachments: [],
              }),
            ]),
          }),
        }),
      ]),
    })
  })
})
