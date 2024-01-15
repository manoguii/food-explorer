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
import { CartItemFactory } from 'test/factories/make-cart-item'

describe('Edit cart (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let jwt: JwtService
  let clientFactory: ClientFactory
  let dishFactory: DishFactory
  let categoryFactory: CategoryFactory
  let cartFactory: CartFactory
  let cartItemFactory: CartItemFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [
        ClientFactory,
        DishFactory,
        CategoryFactory,
        CartFactory,
        CartItemFactory,
      ],
    }).compile()

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)
    jwt = moduleRef.get(JwtService)
    clientFactory = moduleRef.get(ClientFactory)
    dishFactory = moduleRef.get(DishFactory)
    categoryFactory = moduleRef.get(CategoryFactory)
    cartFactory = moduleRef.get(CartFactory)
    cartItemFactory = moduleRef.get(CartItemFactory)

    await app.init()
  })

  test('[PUT] /cart/:cartId', async () => {
    const user = await clientFactory.makePrismaClient()

    const accessToken = jwt.sign({ sub: user.id.toString() })

    const category = await categoryFactory.makePrismaCategory()

    const batata = await dishFactory.makePrismaDish({
      name: 'Batata frita',
      categoryId: category.id,
      price: Price.create(10),
    })

    const cart = await cartFactory.makePrismaCart({
      clientId: user.id,
    })

    await cartItemFactory.makePrismaCartItem({
      cartId: cart.id,
      dishId: batata.id,
      quantity: 10,
    })

    const item = {
      dishId: batata.id.toString(),
      quantity: 2,
    }

    const response = await request(app.getHttpServer())
      .put(`/cart/${cart.id}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        item,
      })

    expect(response.statusCode).toBe(200)

    const cartsOnDatabase = await prisma.cart.findMany()
    const cartItemsOnDatabase = await prisma.cartItem.findMany()

    expect(cartsOnDatabase).toHaveLength(1)
    expect(cartsOnDatabase[0].totalAmount).toBe(20)

    expect(cartItemsOnDatabase).toHaveLength(1)
    expect(cartItemsOnDatabase[0].cost).toBe(20)
  })
})
