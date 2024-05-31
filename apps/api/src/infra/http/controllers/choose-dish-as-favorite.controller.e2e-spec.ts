import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { CategoryFactory } from 'test/factories/make-category'
import { ClientFactory } from 'test/factories/make-client'
import { DishFactory } from 'test/factories/make-dish'

import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'

describe('Choose dish as favorite (E2E)', () => {
  let app: INestApplication
  let jwt: JwtService
  let prisma: PrismaService
  let clientFactory: ClientFactory
  let dishFactory: DishFactory
  let categoryFactory: CategoryFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [PrismaService, ClientFactory, DishFactory, CategoryFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    jwt = moduleRef.get(JwtService)
    prisma = moduleRef.get(PrismaService)
    clientFactory = moduleRef.get(ClientFactory)
    dishFactory = moduleRef.get(DishFactory)
    categoryFactory = moduleRef.get(CategoryFactory)

    await app.init()
  })

  test('[PATCH] /dishes/:dishId/favorite', async () => {
    const user = await clientFactory.makePrismaClient()

    const accessToken = jwt.sign({ sub: user.id.toString() })

    const category = await categoryFactory.makePrismaCategory()

    const dish = await dishFactory.makePrismaDish({
      name: 'Dish 01',
      categoryId: category.id,
    })

    const response = await request(app.getHttpServer())
      .patch(`/dishes/${dish.id}/favorite`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toBe(200)

    const favoriteDishesOnDatabase = await prisma.favoriteDishes.findMany({
      where: {
        userId: user.id.toString(),
        dishId: dish.id.toString(),
      },
    })

    expect(favoriteDishesOnDatabase).toHaveLength(1)
    expect(favoriteDishesOnDatabase[0].userId).toBe(user.id.toString())
    expect(favoriteDishesOnDatabase[0].dishId).toBe(dish.id.toString())
  })
})
