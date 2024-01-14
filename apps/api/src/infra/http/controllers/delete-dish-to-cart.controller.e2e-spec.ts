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
import { CartItemFactory } from 'test/factories/make-cart-item'

describe('Delete dish to cart (E2E)', () => {
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

  test('[DELETE] /cart/:cartId', async () => {
    const user = await clientFactory.makePrismaClient()

    const accessToken = jwt.sign({ sub: user.id.toString() })

    const category = await categoryFactory.makePrismaCategory()

    const [dish, dish2] = await Promise.all([
      dishFactory.makePrismaDish({
        name: 'Batata frita',
        categoryId: category.id,
      }),
      dishFactory.makePrismaDish({
        name: 'Salada',
        categoryId: category.id,
      }),
    ])

    const cart = await cartFactory.makePrismaCart({
      clientId: user.id,
    })

    await Promise.all([
      cartItemFactory.makePrismaCartItem({
        cartId: cart.id,
        dishId: dish.id,
        dishPrice: dish.price,
        quantity: 10,
      }),
      cartItemFactory.makePrismaCartItem({
        cartId: cart.id,
        dishId: dish2.id,
        dishPrice: dish2.price,
        quantity: 10,
      }),
    ])

    const response = await request(app.getHttpServer())
      .delete(`/cart/${cart.id.toString()}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        dishId: dish.id.toString(),
      })

    expect(response.statusCode).toBe(200)

    const cartItemsOnDatabase = await prisma.cartItem.findMany({
      where: {
        cartId: cart.id.toString(),
      },
    })

    const cartsOnDb = await prisma.cart.findMany()

    expect(cartItemsOnDatabase.length).toBe(1)
    expect(cartsOnDb.length).toBe(1)

    await request(app.getHttpServer())
      .delete(`/cart/${cart.id.toString()}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        dishId: dish2.id.toString(),
      })

    const cartsOnDbAfterDelete = await prisma.cart.findMany()
    const cartItemsOnDatabaseAfterDelete = await prisma.cartItem.findMany()

    expect(cartsOnDbAfterDelete.length).toBe(0)
    expect(cartItemsOnDatabaseAfterDelete.length).toBe(0)
  })
})
