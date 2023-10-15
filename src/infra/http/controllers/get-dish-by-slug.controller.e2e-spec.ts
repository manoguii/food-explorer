import { Slug } from '@/domain/restaurant/enterprise/entities/value-objects/slug'
import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { AttachmentFactory } from 'test/factories/make-attachment'
import { CategoryFactory } from 'test/factories/make-category'
import { ClientFactory } from 'test/factories/make-client'
import { DishFactory } from 'test/factories/make-dish'
import { DishAttachmentFactory } from 'test/factories/make-dish-attachment'

describe('Get dish by slug (E2E)', () => {
  let app: INestApplication
  let clientFactory: ClientFactory
  let dishFactory: DishFactory
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
        AttachmentFactory,
        CategoryFactory,
        DishAttachmentFactory,
      ],
    }).compile()

    app = moduleRef.createNestApplication()

    clientFactory = moduleRef.get(ClientFactory)
    dishFactory = moduleRef.get(DishFactory)
    categoryFactory = moduleRef.get(CategoryFactory)
    attachmentFactory = moduleRef.get(AttachmentFactory)
    dishAttachmentFactory = moduleRef.get(DishAttachmentFactory)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test('[GET] /dishes/:slug', async () => {
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

    const response = await request(app.getHttpServer())
      .get(`/dishes/${dish.slug.value}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual({
      dishes: expect.objectContaining({
        name: 'Dish name',
        // attachments: [
        //   expect.objectContaining({
        //     title: 'Attachment title',
        //   }),
        // ],
      }),
    })
  })
})
