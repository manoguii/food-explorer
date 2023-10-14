import { AppModule } from '@/infra/app.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'

describe('Create dish (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test('[POST] /dishes', async () => {
    const user = await prisma.user.create({
      data: {
        name: 'John Doe',
        email: 'johndoe@example.com',
        password: '123456',
      },
    })

    const accessToken = jwt.sign({ sub: user.id })

    const category = await prisma.category.create({
      data: {
        name: 'Category 01',
      },
    })

    const response = await request(app.getHttpServer())
      .post('/dishes')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'Novo prato',
        description: 'Descrição do prato',
        price: '100',
        categoryId: category.id,
      })

    expect(response.statusCode).toBe(201)

    const dishOnDatabase = await prisma.dish.findFirst({
      where: {
        name: 'Novo prato',
      },
    })

    expect(dishOnDatabase).toBeTruthy()
  })
})
