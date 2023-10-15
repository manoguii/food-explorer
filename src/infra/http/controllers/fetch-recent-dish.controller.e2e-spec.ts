import { AppModule } from '@/infra/app.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'

describe('Fetch recent dishes (E2E)', () => {
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

  test('[GET] /dishes', async () => {
    expect(1 + 1).toBe(2)

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

    await prisma.dish.createMany({
      data: [
        {
          name: 'Dish 01',
          slug: 'dish-01',
          description: 'Dish description',
          categoryId: category.id,
          price: '100',
        },
        {
          name: 'Dish 02',
          slug: 'dish-02',
          description: 'Dish description',
          categoryId: category.id,
          price: '100',
        },
      ],
    })

    const response = await request(app.getHttpServer())
      .get('/dishes')
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual({
      dishes: [
        expect.objectContaining({ name: 'Dish 01' }),
        expect.objectContaining({ name: 'Dish 02' }),
      ],
    })
  })
})
