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

import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'

describe('Fetch filtered dishes (E2E)', () => {
  let app: INestApplication
  let jwt: JwtService
  let clientFactory: ClientFactory
  let dishFactory: DishFactory
  let categoryFactory: CategoryFactory
  let attachmentFactory: AttachmentFactory
  let dishAttachmentFactory: DishAttachmentFactory
  let favoriteDishFactory: FavoriteDishFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [
        ClientFactory,
        DishFactory,
        CategoryFactory,
        AttachmentFactory,
        DishAttachmentFactory,
        FavoriteDishFactory,
      ],
    }).compile()

    app = moduleRef.createNestApplication()

    jwt = moduleRef.get(JwtService)
    clientFactory = moduleRef.get(ClientFactory)
    dishFactory = moduleRef.get(DishFactory)
    categoryFactory = moduleRef.get(CategoryFactory)
    attachmentFactory = moduleRef.get(AttachmentFactory)
    dishAttachmentFactory = moduleRef.get(DishAttachmentFactory)
    favoriteDishFactory = moduleRef.get(FavoriteDishFactory)

    await app.init()
  })

  test('[GET] /dishes', async () => {
    const user = await clientFactory.makePrismaClient({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    })

    const accessToken = jwt.sign({ sub: user.id.toString() })

    const [category, category2] = await Promise.all([
      categoryFactory.makePrismaCategory({
        name: 'Bebidas',
      }),
      categoryFactory.makePrismaCategory({
        name: 'Sobremesas',
      }),
    ])

    const [dish] = await Promise.all([
      dishFactory.makePrismaDish({
        name: 'Coca Cola',
        categoryId: category.id,
      }),
      dishFactory.makePrismaDish({
        name: 'Suco de Laranja',
        categoryId: category.id,
      }),
      dishFactory.makePrismaDish({
        name: 'Petit Gateau',
        categoryId: category2.id,
      }),
    ])

    const attachment = await attachmentFactory.makePrismaAttachment({
      title: 'Attachment title',
    })

    await dishAttachmentFactory.makePrismaDishAttachment({
      dishId: dish.id,
      attachmentId: attachment.id,
    })

    await favoriteDishFactory.makePrismaFavoriteDish({
      clientId: user.id,
      dishId: dish.id,
    })

    const response = await request(app.getHttpServer())
      .get('/dishes')
      .set('Authorization', `Bearer ${accessToken}`)
      .query({
        page: 1,
        query: 'Coca',
      })
      .send()

    expect(response.statusCode).toBe(200)
    expect(response.body.dishes).toHaveLength(1)
    expect(response.body).toEqual({
      dishes: expect.arrayContaining([
        expect.objectContaining({
          name: 'Coca Cola',
          ingredients: expect.arrayContaining([]),
          attachments: expect.arrayContaining([
            expect.objectContaining({
              title: 'Attachment title',
            }),
          ]),
          isFavorite: true,
        }),
      ]),
      totalPages: expect.any(Number),
    })
  })
})
