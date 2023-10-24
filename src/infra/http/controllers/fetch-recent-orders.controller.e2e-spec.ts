import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { CategoryFactory } from 'test/factories/make-category'
import { ClientFactory } from 'test/factories/make-client'
import { DishFactory } from 'test/factories/make-dish'
import { OrderFactory } from 'test/factories/make-order'
import { OrderItemFactory } from 'test/factories/make-order-item'

describe('Fetch recent orders (E2E)', () => {
  let app: INestApplication
  let jwt: JwtService
  let clientFactory: ClientFactory
  let orderFactory: OrderFactory
  let categoryFactory: CategoryFactory
  let dishFactory: DishFactory
  let orderItemFactory: OrderItemFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [
        ClientFactory,
        OrderFactory,
        CategoryFactory,
        DishFactory,
        OrderItemFactory,
      ],
    }).compile()

    app = moduleRef.createNestApplication()

    jwt = moduleRef.get(JwtService)
    clientFactory = moduleRef.get(ClientFactory)
    orderFactory = moduleRef.get(OrderFactory)
    categoryFactory = moduleRef.get(CategoryFactory)
    dishFactory = moduleRef.get(DishFactory)
    orderItemFactory = moduleRef.get(OrderItemFactory)

    await app.init()
  })

  test('[GET] /orders', async () => {
    const user = await clientFactory.makePrismaClient({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    })
    const userTest = await clientFactory.makePrismaClient()

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

    const [order] = await Promise.all([
      orderFactory.makePrismaOrder({
        clientId: user.id,
      }),
      orderFactory.makePrismaOrder({
        clientId: userTest.id,
      }),
    ])

    await Promise.all([
      orderItemFactory.makePrismaOrderItem({
        orderId: order.id,
        dishId: dish.id,
      }),
      orderItemFactory.makePrismaOrderItem({
        orderId: order.id,
        dishId: dish2.id,
      }),
    ])

    const response = await request(app.getHttpServer())
      .get('/orders')
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    console.log(response.body.orders)
    expect(response.statusCode).toBe(200)
    expect(response.body.orders).toHaveLength(1)
    expect(response.body).toEqual({
      orders: expect.arrayContaining([
        expect.objectContaining({ clientId: user.id.toString() }),
      ]),
    })
  })
})
