import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { CategoryFactory } from 'test/factories/make-category'
import { ClientFactory } from 'test/factories/make-client'
import { DishFactory } from 'test/factories/make-dish'

describe('Fetch recent dishes (E2E)', () => {
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

  test('[GET] /dishes', async () => {
    const user = await clientFactory.makePrismaClient({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    })

    const accessToken = jwt.sign({ sub: user.id.toString() })

    const category = await categoryFactory.makePrismaCategory()

    await Promise.all([
      dishFactory.makePrismaDish({
        name: 'Dish 01',
        categoryId: category.id,
      }),
      dishFactory.makePrismaDish({
        name: 'Dish 02',
        categoryId: category.id,
      }),
    ])

    const response = await request(app.getHttpServer())
      .get('/dishes')
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual({
      dishes: expect.arrayContaining([
        expect.objectContaining({ name: 'Dish 01' }),
        expect.objectContaining({ name: 'Dish 02' }),
      ]),
    })
  })
})
