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

describe('Create dish (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let jwt: JwtService
  let attachmentFactory: AttachmentFactory
  let clientFactory: ClientFactory
  let categoryFactory: CategoryFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [AttachmentFactory, ClientFactory, CategoryFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)
    jwt = moduleRef.get(JwtService)
    attachmentFactory = moduleRef.get(AttachmentFactory)
    clientFactory = moduleRef.get(ClientFactory)
    categoryFactory = moduleRef.get(CategoryFactory)

    await app.init()
  })

  test('[POST] /dishes', async () => {
    const user = await clientFactory.makePrismaClient()

    const accessToken = jwt.sign({ sub: user.id.toString() })

    const category = await categoryFactory.makePrismaCategory()

    const attachment1 = await attachmentFactory.makePrismaAttachment()
    const attachment2 = await attachmentFactory.makePrismaAttachment()

    const response = await request(app.getHttpServer())
      .post('/dishes')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'Novo prato',
        description: 'Descrição do prato',
        price: 100,
        categoryId: category.id.toString(),
        ingredients: ['Batata', 'Cebola', 'Queijo'],
        attachmentsIds: [attachment1.id.toString(), attachment2.id.toString()],
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
    expect(ingredientsOnDatabase).toHaveLength(3)
  })
})
