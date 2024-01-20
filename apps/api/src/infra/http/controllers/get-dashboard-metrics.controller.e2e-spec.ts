import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
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

describe('Get dashboard metrics (E2E)', () => {
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

  test('[GET] /dashboard-metrics', async () => {
    const adminUser = await clientFactory.makePrismaClient({
      name: 'Admin User',
      email: 'admin@mail.com',
      password: '123456',
      role: 'ADMIN',
    })

    const accessToken = jwt.sign({ sub: adminUser.id.toString() })

    const [user, user2] = await Promise.all([
      clientFactory.makePrismaClient({
        name: 'John Doe',
        email: 'johndoe@mail.com',
        password: '123456',
      }),
      clientFactory.makePrismaClient({
        name: 'Jared summer',
        email: 'jaredsummer@mail.com',
        password: '123456',
      }),
    ])

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

    const [cart, cart2] = await Promise.all([
      cartFactory.makePrismaCart({
        clientId: user.id,
      }),
      cartFactory.makePrismaCart({
        clientId: user2.id,
      }),
    ])

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
      cartItemFactory.makePrismaCartItem({
        cartId: cart2.id,
        dishId: dish.id,
        quantity: 2,
      }),
      cartItemFactory.makePrismaCartItem({
        cartId: cart2.id,
        dishId: dish2.id,
        quantity: 1,
      }),
    ])

    const [order, order2] = await Promise.all([
      orderFactory.makePrismaOrder({
        clientId: user.id,
        cartId: cart.id,
        createdAt: new Date(new Date().getTime() - 4 * 60 * 60 * 1000),
      }),
      orderFactory.makePrismaOrder({
        clientId: user2.id,
        cartId: cart2.id,
        createdAt: new Date(new Date().getTime() - 4 * 60 * 60 * 1000),
      }),
    ])

    const totalRevenue = order.amountTotal + order2.amountTotal

    const response = await request(app.getHttpServer())
      .get('/dashboard-metrics')
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    const { metrics } = response.body

    expect(response.statusCode).toBe(200)

    expect(metrics.totalRevenue.value).toBe(totalRevenue)
    expect(metrics.sales.value).toBe(2)
    expect(metrics.activeClients.value).toBe(2)
    expect(metrics.recentSales).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          total: order.amountTotal,
          client: expect.objectContaining({
            name: user.name,
          }),
        }),
        expect.objectContaining({
          total: order2.amountTotal,
          client: expect.objectContaining({
            name: user2.name,
          }),
        }),
      ]),
    )
  })
})
