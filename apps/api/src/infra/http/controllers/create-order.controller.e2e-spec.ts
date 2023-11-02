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

describe('Create order (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let jwt: JwtService
  let clientFactory: ClientFactory
  let dishFactory: DishFactory
  let categoryFactory: CategoryFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [ClientFactory, CategoryFactory, DishFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)
    jwt = moduleRef.get(JwtService)
    clientFactory = moduleRef.get(ClientFactory)
    categoryFactory = moduleRef.get(CategoryFactory)
    dishFactory = moduleRef.get(DishFactory)

    await app.init()
  })

  test('[POST] /orders', async () => {
    const user = await clientFactory.makePrismaClient()

    const accessToken = jwt.sign({ sub: user.id.toString() })

    const category = await categoryFactory.makePrismaCategory()

    const dish = await dishFactory.makePrismaDish({
      categoryId: category.id,
    })

    const items = [
      {
        dishId: dish.id.toString(),
        quantity: 2,
      },
    ]

    const response = await request(app.getHttpServer())
      .post('/orders')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        items,
      })

    expect(response.statusCode).toBe(201)

    const orderDetails = items
      .map((item) => {
        return `${item.quantity} x ${dish.name}`
      })
      .join(', ')

    const ordersOnDatabase = await prisma.order.findMany()

    expect(ordersOnDatabase[0].orderDetails).toBe(orderDetails)
    expect(ordersOnDatabase).toHaveLength(1)

    const orderItemsOnDatabase = await prisma.orderItem.findMany({
      where: {
        dishId: dish.id.toString(),
      },
    })

    expect(orderItemsOnDatabase).toHaveLength(1)
  })
})
