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

describe('Add dish to cart (E2E)', () => {
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

  test('[POST] /cart/:cartId', async () => {
    const user = await clientFactory.makePrismaClient()

    const accessToken = jwt.sign({ sub: user.id.toString() })

    const category = await categoryFactory.makePrismaCategory()

    const dish = await dishFactory.makePrismaDish({
      name: 'Batata frita',
      categoryId: category.id,
    })

    const cart = await cartFactory.makePrismaCart({
      clientId: user.id,
    })

    const response = await request(app.getHttpServer())
      .post(`/cart/${cart.id.toString()}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        dishId: dish.id.toString(),
        quantity: 2,
      })

    expect(response.statusCode).toBe(201)

    const cartItemsOnDatabase = await prisma.cartItem.findMany({
      where: {
        cartId: cart.id.toString(),
      },
    })

    expect(cartItemsOnDatabase.length).toBe(1)
    expect(cartItemsOnDatabase[0].dishId).toBe(dish.id.toString())
    expect(cartItemsOnDatabase[0].quantity).toBe(2)
  })
})
