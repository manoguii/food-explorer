import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { CategoryFactory } from 'test/factories/make-category'
import { ClientFactory } from 'test/factories/make-client'
import { DishFactory } from 'test/factories/make-dish'
import { OrderFactory } from 'test/factories/make-order'
import { OrderItemFactory } from 'test/factories/make-order-item'

describe('Edit order (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let jwt: JwtService
  let clientFactory: ClientFactory
  let dishFactory: DishFactory
  let categoryFactory: CategoryFactory
  let orderFactory: OrderFactory
  let orderItemFactory: OrderItemFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [
        ClientFactory,
        DishFactory,
        CategoryFactory,
        OrderFactory,
        OrderItemFactory,
      ],
    }).compile()

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)
    jwt = moduleRef.get(JwtService)
    clientFactory = moduleRef.get(ClientFactory)
    dishFactory = moduleRef.get(DishFactory)
    categoryFactory = moduleRef.get(CategoryFactory)
    orderFactory = moduleRef.get(OrderFactory)
    orderItemFactory = moduleRef.get(OrderItemFactory)

    await app.init()
  })

  test('[PUT] /orders/:orderId', async () => {
    const user = await clientFactory.makePrismaClient({
      role: 'ADMIN',
    })

    const accessToken = jwt.sign({ sub: user.id.toString() })

    const category = await categoryFactory.makePrismaCategory()

    const dish = await dishFactory.makePrismaDish({
      name: 'Batata frita',
      categoryId: category.id,
    })

    const dish2 = await dishFactory.makePrismaDish({
      name: 'Macarrão',
      categoryId: category.id,
    })

    const order = await orderFactory.makePrismaOrder({
      clientId: user.id,
    })

    await orderItemFactory.makePrismaOrderItem({
      orderId: order.id,
      dishId: dish.id,
      quantity: 3,
    })

    await orderItemFactory.makePrismaOrderItem({
      orderId: order.id,
      dishId: dish2.id,
      quantity: 1,
    })

    const response = await request(app.getHttpServer())
      .put(`/orders/${order.id.toString()}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        items: [
          {
            dishId: dish.id.toString(),
            quantity: 2,
          },
        ],
      })

    expect(response.statusCode).toBe(200)

    const ordersOnDatabase = await prisma.order.findMany()

    expect(ordersOnDatabase).toHaveLength(1)
    expect(ordersOnDatabase[0].orderDetails).toEqual('2 x Batata frita')

    const orderItemsOnDatabase = await prisma.orderItem.findMany({
      where: {
        orderId: order.id.toString(),
      },
    })

    expect(orderItemsOnDatabase).toHaveLength(1)
    expect(orderItemsOnDatabase).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          orderId: order.id.toString(),
          dishId: dish.id.toString(),
          quantity: 2,
        }),
      ]),
    )
  })
})
