import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { AttachmentFactory } from 'test/factories/make-attachment'
import { CategoryFactory } from 'test/factories/make-category'
import { ClientFactory } from 'test/factories/make-client'
import { OrderFactory } from 'test/factories/make-order'
import { DishAttachmentFactory } from 'test/factories/make-dish-attachment'
import { IngredientFactory } from 'test/factories/make-ingredient'
import { DishFactory } from 'test/factories/make-dish'
import { Slug } from '@/domain/restaurant/enterprise/entities/value-objects/slug'
import { OrderItemFactory } from 'test/factories/make-order-item'

describe('Get order by id (E2E)', () => {
  let app: INestApplication
  let dishFactory: DishFactory
  let clientFactory: ClientFactory
  let orderFactory: OrderFactory
  let orderItemFactory: OrderItemFactory
  let attachmentFactory: AttachmentFactory
  let categoryFactory: CategoryFactory
  let dishAttachmentFactory: DishAttachmentFactory
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [
        ClientFactory,
        DishFactory,
        OrderFactory,
        OrderItemFactory,
        AttachmentFactory,
        CategoryFactory,
        IngredientFactory,
        DishAttachmentFactory,
      ],
    }).compile()

    app = moduleRef.createNestApplication()

    clientFactory = moduleRef.get(ClientFactory)
    dishFactory = moduleRef.get(DishFactory)
    orderFactory = moduleRef.get(OrderFactory)
    orderItemFactory = moduleRef.get(OrderItemFactory)
    categoryFactory = moduleRef.get(CategoryFactory)
    attachmentFactory = moduleRef.get(AttachmentFactory)
    dishAttachmentFactory = moduleRef.get(DishAttachmentFactory)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test('[GET] /orders/:id', async () => {
    const user = await clientFactory.makePrismaClient({
      name: 'John Doe',
    })

    const accessToken = jwt.sign({ sub: user.id.toString() })

    const category = await categoryFactory.makePrismaCategory()

    const dish = await dishFactory.makePrismaDish({
      name: 'Dish name',
      slug: Slug.create('dish-title'),
      categoryId: category.id,
    })

    const attachment = await attachmentFactory.makePrismaAttachment({
      title: 'Attachment title',
    })

    await dishAttachmentFactory.makePrismaDishAttachment({
      dishId: dish.id,
      attachmentId: attachment.id,
    })

    const order = await orderFactory.makePrismaOrder({
      clientId: user.id,
    })

    await orderItemFactory.makePrismaOrderItem({
      orderId: order.id,
      dishId: dish.id,
      quantity: 1,
    })

    const response = await request(app.getHttpServer())
      .get(`/orders/${order.id.toString()}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual({
      order: expect.objectContaining({
        code: order.code.value,
        status: order.status,

        dishes: expect.arrayContaining([
          expect.objectContaining({
            id: dish.id.toString(),
            name: dish.name,
            price: dish.price,
            attachments: expect.arrayContaining([
              expect.objectContaining({
                id: attachment.id.toString(),
                title: attachment.title,
                url: attachment.url,
              }),
            ]),
            quantity: 1,
          }),
        ]),
      }),
    })
  })
})
