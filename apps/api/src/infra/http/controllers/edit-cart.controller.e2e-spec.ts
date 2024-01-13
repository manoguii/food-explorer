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
import { CartFactory } from 'test/factories/make-cart'
import { Price } from '@/domain/restaurant/enterprise/entities/value-objects/price'

describe('Edit cart (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let jwt: JwtService
  let clientFactory: ClientFactory
  let dishFactory: DishFactory
  let categoryFactory: CategoryFactory
  let cartFactory: CartFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [ClientFactory, DishFactory, CategoryFactory, CartFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)
    jwt = moduleRef.get(JwtService)
    clientFactory = moduleRef.get(ClientFactory)
    dishFactory = moduleRef.get(DishFactory)
    categoryFactory = moduleRef.get(CategoryFactory)
    cartFactory = moduleRef.get(CartFactory)

    await app.init()
  })

  test('[PUT] /carts/:cartId', async () => {
    const user = await clientFactory.makePrismaClient()

    const accessToken = jwt.sign({ sub: user.id.toString() })

    const category = await categoryFactory.makePrismaCategory()

    const [batata, salada] = await Promise.all([
      dishFactory.makePrismaDish({
        name: 'Batata frita',
        categoryId: category.id,
        price: Price.create(10),
      }),
      dishFactory.makePrismaDish({
        name: 'Salada',
        categoryId: category.id,
        price: Price.create(10),
      }),
    ])

    const cart = await cartFactory.makePrismaCart({
      clientId: user.id,
    })

    const items = [
      {
        dishId: batata.id.toString(),
        quantity: 2,
      },
      {
        dishId: salada.id.toString(),
        quantity: 1,
      },
    ]

    const response = await request(app.getHttpServer())
      .put(`/carts/${cart.id.toString()}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        items,
      })

    expect(response.statusCode).toBe(200)

    const cartsOnDatabase = await prisma.cart.findMany()

    const cartItemsOnDatabase = await prisma.cartItem.findMany()

    expect(cartsOnDatabase).toHaveLength(1)
    expect(cartsOnDatabase[0].totalAmount).toBe(30)

    expect(cartItemsOnDatabase).toHaveLength(2)

    const items2 = [
      {
        dishId: batata.id.toString(),
        quantity: 1,
      },
    ]

    const response2 = await request(app.getHttpServer())
      .put(`/carts/${cart.id.toString()}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        items: items2,
      })

    expect(response2.statusCode).toBe(200)

    const cartsOnDatabase2 = await prisma.cart.findMany()

    const cartItemsOnDatabase2 = await prisma.cartItem.findMany()

    expect(cartsOnDatabase2).toHaveLength(1)
    expect(cartsOnDatabase2[0].totalAmount).toBe(10)

    expect(cartItemsOnDatabase2).toHaveLength(1)
  })
})
