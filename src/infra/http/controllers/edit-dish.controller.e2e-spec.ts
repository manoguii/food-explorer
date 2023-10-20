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
import { DishIngredientFactory } from 'test/factories/make-dish-ingredient'
import { IngredientFactory } from 'test/factories/make-ingredient'

describe('Edit dish (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let jwt: JwtService
  let clientFactory: ClientFactory
  let dishFactory: DishFactory
  let categoryFactory: CategoryFactory
  let attachmentFactory: AttachmentFactory
  let ingredientFactory: IngredientFactory
  let dishAttachmentFactory: DishAttachmentFactory
  let dishIngredientFactory: DishIngredientFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [
        ClientFactory,
        DishFactory,
        AttachmentFactory,
        IngredientFactory,
        DishAttachmentFactory,
        DishIngredientFactory,
        CategoryFactory,
      ],
    }).compile()

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)
    jwt = moduleRef.get(JwtService)
    clientFactory = moduleRef.get(ClientFactory)
    dishFactory = moduleRef.get(DishFactory)
    categoryFactory = moduleRef.get(CategoryFactory)
    attachmentFactory = moduleRef.get(AttachmentFactory)
    ingredientFactory = moduleRef.get(IngredientFactory)
    dishAttachmentFactory = moduleRef.get(DishAttachmentFactory)
    dishIngredientFactory = moduleRef.get(DishIngredientFactory)

    await app.init()
  })

  test('[POST] /dishes/:id', async () => {
    const user = await clientFactory.makePrismaClient()

    const accessToken = jwt.sign({ sub: user.id.toString() })

    const category = await categoryFactory.makePrismaCategory()

    const dish = await dishFactory.makePrismaDish({
      name: 'Batata frita',
      categoryId: category.id,
    })

    const [attachment1, attachment2] = await Promise.all([
      attachmentFactory.makePrismaAttachment(),
      attachmentFactory.makePrismaAttachment(),
    ])

    const [ingredient1, ingredient2] = await Promise.all([
      ingredientFactory.makePrismaIngredient({
        name: 'Batata',
      }),
      ingredientFactory.makePrismaIngredient({
        name: 'Abacaxi',
      }),
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
        ingredientName: ingredient1.name,
        dishId: dish.id,
      }),
      dishIngredientFactory.makePrismaDishIngredient({
        ingredientName: ingredient2.name,
        dishId: dish.id,
      }),
    ])

    const newAttachment = await attachmentFactory.makePrismaAttachment()

    const response = await request(app.getHttpServer())
      .post(`/dishes/${dish.id}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'Novo prato',
        description: 'Descrição do prato',
        price: 100,
        categoryId: category.id,
        ingredients: ['Batata', 'Cebola', 'Queijo'],
        attachmentsIds: [
          attachment1.id.toString(),
          newAttachment.id.toString(),
        ],
      })

    expect(response.statusCode).toBe(201)

    const dishOnDatabase = await prisma.dish.findFirst({
      where: {
        name: 'Novo prato',
      },
    })

    expect(dishOnDatabase).toBeTruthy()

    const attachmentsOnDatabase = await prisma.attachment.findMany({
      where: {
        dishId: dishOnDatabase?.id,
      },
    })

    const ingredientsOnDatabase = await prisma.ingredient.findMany({
      where: {
        dishId: dishOnDatabase?.id,
      },
    })

    expect(attachmentsOnDatabase).toHaveLength(2)
    expect(attachmentsOnDatabase).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: attachment1.id.toString(),
        }),
        expect.objectContaining({
          id: newAttachment.id.toString(),
        }),
      ]),
    )

    expect(ingredientsOnDatabase).toHaveLength(3)
    expect(ingredientsOnDatabase).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: 'Batata',
        }),
        expect.objectContaining({
          name: 'Cebola',
        }),
        expect.objectContaining({
          name: 'Queijo',
        }),
      ]),
    )
  })
})
