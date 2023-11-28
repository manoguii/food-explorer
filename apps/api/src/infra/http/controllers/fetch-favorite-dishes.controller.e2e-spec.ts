import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { AttachmentFactory } from 'test/factories/make-attachment'
import { CategoryFactory } from 'test/factories/make-category'
import { ClientFactory } from 'test/factories/make-client'
import { DishFactory } from 'test/factories/make-dish'
import { DishAttachmentFactory } from 'test/factories/make-dish-attachment'
import { FavoriteDishFactory } from 'test/factories/make-favorite-dish'

describe('Fetch favorite dishes (E2E)', () => {
  let app: INestApplication
  let jwt: JwtService
  let prisma: PrismaService
  let favoriteDishFactory: FavoriteDishFactory
  let clientFactory: ClientFactory
  let dishFactory: DishFactory
  let categoryFactory: CategoryFactory
  let attachmentFactory: AttachmentFactory
  let dishAttachmentFactory: DishAttachmentFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [
        PrismaService,
        ClientFactory,
        DishFactory,
        CategoryFactory,
        FavoriteDishFactory,
        AttachmentFactory,
        DishAttachmentFactory,
      ],
    }).compile()

    app = moduleRef.createNestApplication()

    jwt = moduleRef.get(JwtService)
    prisma = moduleRef.get(PrismaService)
    clientFactory = moduleRef.get(ClientFactory)
    dishFactory = moduleRef.get(DishFactory)
    categoryFactory = moduleRef.get(CategoryFactory)
    favoriteDishFactory = moduleRef.get(FavoriteDishFactory)
    attachmentFactory = moduleRef.get(AttachmentFactory)
    dishAttachmentFactory = moduleRef.get(DishAttachmentFactory)

    await app.init()
  })

  test('[GET] /dish/favorites', async () => {
    const user = await clientFactory.makePrismaClient()

    const accessToken = jwt.sign({ sub: user.id.toString() })

    const [attachment1, attachment2] = await Promise.all([
      attachmentFactory.makePrismaAttachment(),
      attachmentFactory.makePrismaAttachment(),
    ])

    const category = await categoryFactory.makePrismaCategory()

    const [dish01, dish02] = await Promise.all([
      dishFactory.makePrismaDish({
        name: 'Dish 01',
        categoryId: category.id,
      }),
      dishFactory.makePrismaDish({
        name: 'Dish 02',
        categoryId: category.id,
      }),
      dishFactory.makePrismaDish({
        name: 'Dish 03',
        categoryId: category.id,
      }),
    ])

    await Promise.all([
      dishAttachmentFactory.makePrismaDishAttachment({
        dishId: dish01.id,
        attachmentId: attachment1.id,
      }),
      dishAttachmentFactory.makePrismaDishAttachment({
        dishId: dish02.id,
        attachmentId: attachment2.id,
      }),
    ])

    await Promise.all([
      favoriteDishFactory.makePrismaFavoriteDish({
        clientId: user.id,
        dishId: dish01.id,
      }),
      favoriteDishFactory.makePrismaFavoriteDish({
        clientId: user.id,
        dishId: dish02.id,
      }),
    ])

    const response = await request(app.getHttpServer())
      .get('/dish/favorites')
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toBe(200)

    const favoriteDishOnDatabase = await prisma.favoriteDishes.findMany({
      where: {
        userId: user.id.toString(),
      },
    })

    expect(favoriteDishOnDatabase).toHaveLength(2)
    expect(response.body.favoriteDishes).toHaveLength(2)
    expect(favoriteDishOnDatabase).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          dishId: dish01.id.toString(),
        }),
        expect.objectContaining({
          dishId: dish02.id.toString(),
        }),
      ]),
    )

    expect(response.body.favoriteDishes).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: dish01.id.toString(),
          name: dish01.name,
          description: dish01.description,
          price: dish01.price,
          slug: dish01.slug.value,
          ingredients: expect.arrayContaining([]),
          attachments: expect.arrayContaining([
            expect.objectContaining({
              title: attachment1.title,
              url: attachment1.url,
            }),
          ]),
        }),
        expect.objectContaining({
          id: dish02.id.toString(),
          name: dish02.name,
          description: dish02.description,
          price: dish02.price,
          slug: dish02.slug.value,
          ingredients: expect.arrayContaining([]),
          attachments: expect.arrayContaining([
            expect.objectContaining({
              title: attachment2.title,
              url: attachment2.url,
            }),
          ]),
        }),
      ]),
    )
  })
})
