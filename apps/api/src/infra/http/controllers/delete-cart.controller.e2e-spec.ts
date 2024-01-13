import { CreateCartUseCase } from '@/domain/restaurant/application/use-cases/create-cart'
import { Cart } from '@/domain/restaurant/enterprise/entities/cart'
import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { CategoryFactory } from 'test/factories/make-category'
import { ClientFactory } from 'test/factories/make-client'
import { DishFactory } from 'test/factories/make-dish'
import { CartItemFactory } from 'test/factories/make-cart-item'
import { PrismaService } from '@/infra/database/prisma/prisma.service'

describe('Fetch recent carts (E2E)', () => {
  let app: INestApplication
  let jwt: JwtService
  let prisma: PrismaService
  let clientFactory: ClientFactory
  let createCartUseCase: CreateCartUseCase
  let categoryFactory: CategoryFactory
  let dishFactory: DishFactory
  let cartItemFactory: CartItemFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [
        ClientFactory,
        CreateCartUseCase,
        PrismaService,
        CategoryFactory,
        DishFactory,
        CartItemFactory,
      ],
    }).compile()

    app = moduleRef.createNestApplication()

    jwt = moduleRef.get(JwtService)
    clientFactory = moduleRef.get(ClientFactory)
    categoryFactory = moduleRef.get(CategoryFactory)
    dishFactory = moduleRef.get(DishFactory)
    prisma = moduleRef.get(PrismaService)
    cartItemFactory = moduleRef.get(CartItemFactory)
    createCartUseCase = moduleRef.get(CreateCartUseCase)

    await app.init()
  })

  test('[DELETE] /cart', async () => {
    const user = await clientFactory.makePrismaClient({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    })

    const accessToken = jwt.sign({ sub: user.id.toString() })

    const category = await categoryFactory.makePrismaCategory()

    const [dish, dish2] = await Promise.all([
      dishFactory.makePrismaDish({
        name: 'Batata frita',
        categoryId: category.id,
      }),
      dishFactory.makePrismaDish({
        name: 'Macarrão',
        categoryId: category.id,
      }),
    ])

    const cart = await createCartUseCase.execute({
      clientId: user.id.toString(),
    })

    const result = cart.value as { cart: Cart }

    await Promise.all([
      cartItemFactory.makePrismaCartItem({
        cartId: result.cart.id,
        dishId: dish.id,
      }),
      cartItemFactory.makePrismaCartItem({
        cartId: result.cart.id,
        dishId: dish2.id,
      }),
    ])

    const response = await request(app.getHttpServer())
      .delete(`/cart/${result.cart.id}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toBe(200)

    const cartOnDatabase = await prisma.cart.findMany()

    expect(cartOnDatabase).toHaveLength(0)
  })
})
