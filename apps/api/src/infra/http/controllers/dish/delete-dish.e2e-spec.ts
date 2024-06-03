import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { AttachmentFactory } from 'test/factories/make-attachment'
import { CategoryFactory } from 'test/factories/make-category'
import { ClientFactory } from 'test/factories/make-client'
import { DishFactory } from 'test/factories/make-dish'
import { DishAttachmentFactory } from 'test/factories/make-dish-attachment'
import { DishIngredientFactory } from 'test/factories/make-dish-ingredient'

import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'

describe('Delete dish (E2E)', () => {
  let app: INestApplication
  let jwt: JwtService
  let prisma: PrismaService
  let clientFactory: ClientFactory
  let categoryFactory: CategoryFactory
  let dishFactory: DishFactory
  let attachmentFactory: AttachmentFactory
  let dishIngredientFactory: DishIngredientFactory
  let dishAttachmentFactory: DishAttachmentFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [
        PrismaService,
        ClientFactory,
        CategoryFactory,
        DishFactory,
        AttachmentFactory,
        DishIngredientFactory,
        DishAttachmentFactory,
      ],
    }).compile()

    app = moduleRef.createNestApplication()

    jwt = moduleRef.get(JwtService)
    prisma = moduleRef.get(PrismaService)
    clientFactory = moduleRef.get(ClientFactory)
    categoryFactory = moduleRef.get(CategoryFactory)
    dishFactory = moduleRef.get(DishFactory)
    attachmentFactory = moduleRef.get(AttachmentFactory)
    dishIngredientFactory = moduleRef.get(DishIngredientFactory)
    dishAttachmentFactory = moduleRef.get(DishAttachmentFactory)

    await app.init()
  })

  test('[DELETE] /dishes/:dishId', async () => {
    const user = await clientFactory.makePrismaClient({
      role: 'ADMIN',
    })

    const accessToken = jwt.sign({ sub: user.id.toString() })

    const category = await categoryFactory.makePrismaCategory()

    const dish = await dishFactory.makePrismaDish({
      categoryId: category.id,
    })

    const [attachment1, attachment2] = await Promise.all([
      attachmentFactory.makePrismaAttachment(),
      attachmentFactory.makePrismaAttachment(),
    ])

    await Promise.all([
      dishAttachmentFactory.makePrismaDishAttachment({
        attachmentId: attachment1.id,
        dishId: dish.id,
      }),
      dishAttachmentFactory.makePrismaDishAttachment({
        attachmentId: attachment2.id,
        dishId: dish.id,
      }),
    ])

    await Promise.all([
      dishIngredientFactory.makePrismaDishIngredient({
        ingredientName: 'Batata',
        dishId: dish.id,
      }),
      dishIngredientFactory.makePrismaDishIngredient({
        ingredientName: 'Abacaxi',
        dishId: dish.id,
      }),
    ])

    const response = await request(app.getHttpServer())
      .delete(`/dishes/${dish.id.toString()}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toBe(200)

    const dishesOnDatabase = await prisma.dish.findMany()
    const ingredientsOnDatabase = await prisma.ingredient.findMany()
    const attachmentsOnDatabase = await prisma.attachment.findMany()

    expect(dishesOnDatabase).toHaveLength(0)
    expect(ingredientsOnDatabase).toHaveLength(0)
    expect(attachmentsOnDatabase).toHaveLength(0)
  })
})
