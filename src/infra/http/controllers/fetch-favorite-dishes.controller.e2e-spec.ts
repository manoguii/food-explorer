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
import { FavoriteDishFactory } from 'test/factories/make-favorite-dish'

describe('Fetch favorite dishes (E2E)', () => {
  let app: INestApplication
  let jwt: JwtService
  let prisma: PrismaService
  let favoriteDishFactory: FavoriteDishFactory
  let clientFactory: ClientFactory
  let dishFactory: DishFactory
  let categoryFactory: CategoryFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [
        PrismaService,
        ClientFactory,
        DishFactory,
        CategoryFactory,
        FavoriteDishFactory,
      ],
    }).compile()

    app = moduleRef.createNestApplication()

    jwt = moduleRef.get(JwtService)
    prisma = moduleRef.get(PrismaService)
    clientFactory = moduleRef.get(ClientFactory)
    dishFactory = moduleRef.get(DishFactory)
    categoryFactory = moduleRef.get(CategoryFactory)
    favoriteDishFactory = moduleRef.get(FavoriteDishFactory)

    await app.init()
  })

  test('[GET] /dish/favorites', async () => {
    const user = await clientFactory.makePrismaClient()

    const accessToken = jwt.sign({ sub: user.id.toString() })

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

    await favoriteDishFactory.makePrismaFavoriteDish({
      clientId: user.id,
      dishId: dish01.id,
    })

    await favoriteDishFactory.makePrismaFavoriteDish({
      clientId: user.id,
      dishId: dish02.id,
    })

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
    expect(response.body.dishes).toHaveLength(2)
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
  })
})
