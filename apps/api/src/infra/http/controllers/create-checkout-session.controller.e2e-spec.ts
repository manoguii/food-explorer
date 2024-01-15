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
import { PaymentModule } from '@/infra/payment/payment.module'
import { AttachmentFactory } from 'test/factories/make-attachment'
import { DishAttachmentFactory } from 'test/factories/make-dish-attachment'

describe('Create checkout session (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let jwt: JwtService
  let clientFactory: ClientFactory
  let dishFactory: DishFactory
  let categoryFactory: CategoryFactory
  let cartFactory: CartFactory
  let cartItemFactory: CartItemFactory
  let attachmentFactory: AttachmentFactory
  let dishAttachmentFactory: DishAttachmentFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule, PaymentModule],
      providers: [
        ClientFactory,
        DishFactory,
        CategoryFactory,
        CartFactory,
        CartItemFactory,
        AttachmentFactory,
        DishAttachmentFactory,
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
    attachmentFactory = moduleRef.get(AttachmentFactory)
    dishAttachmentFactory = moduleRef.get(DishAttachmentFactory)

    await app.init()
  })

  test('[POST] /checkout-session/:cartId', async () => {
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

    await cartItemFactory.makePrismaCartItem({
      cartId: cart.id,
      dishId: dish.id,
      quantity: 1,
    })

    const attachment = await attachmentFactory.makePrismaAttachment({
      url: 'e300191d-d458-4a4d-9888-ae23ceed19a1-dish-1.png',
    })

    await dishAttachmentFactory.makePrismaDishAttachment({
      dishId: dish.id,
      attachmentId: attachment.id,
    })

    const response = await request(app.getHttpServer())
      .post(`/checkout-session/${cart.id.toString()}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toBe(201)

    const cartItemsOnDatabase = await prisma.cartItem.findMany({
      where: {
        cartId: cart.id.toString(),
      },
    })

    expect(cartItemsOnDatabase.length).toBe(1)

    const checkoutSessionUrl = response.body.checkoutSessionUrl

    console.log(checkoutSessionUrl)

    expect(checkoutSessionUrl).toEqual(expect.any(String))
  })
})
