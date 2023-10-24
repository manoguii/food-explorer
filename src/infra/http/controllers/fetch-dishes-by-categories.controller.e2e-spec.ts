import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { CategoryFactory } from 'test/factories/make-category'
import { ClientFactory } from 'test/factories/make-client'
import { DishFactory } from 'test/factories/make-dish'

describe('Fetch dishes by categories (E2E)', () => {
  let app: INestApplication
  let jwt: JwtService
  let clientFactory: ClientFactory
  let dishFactory: DishFactory
  let categoryFactory: CategoryFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [ClientFactory, DishFactory, CategoryFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    jwt = moduleRef.get(JwtService)
    clientFactory = moduleRef.get(ClientFactory)
    dishFactory = moduleRef.get(DishFactory)
    categoryFactory = moduleRef.get(CategoryFactory)

    await app.init()
  })

  test('[GET] /dishes/categories', async () => {
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

    await Promise.all([
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

    const response = await request(app.getHttpServer())
      .get('/dish/categories')
      .query({
        categories: ['Bebidas', 'Sobremesas'],
      })
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    console.log(response.body.dishes)

    expect(response.statusCode).toBe(200)
    expect(response.body.dishes).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          category: 'Bebidas',
          items: expect.arrayContaining([
            expect.objectContaining({
              name: 'Coca Cola',
            }),
            expect.objectContaining({
              name: 'Suco de Laranja',
            }),
          ]),
        }),
        expect.objectContaining({
          category: 'Sobremesas',
          items: expect.arrayContaining([
            expect.objectContaining({
              name: 'Petit Gateau',
            }),
          ]),
        }),
      ]),
    )
  })
})
