import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { AttachmentFactory } from 'test/factories/make-attachment'
import { CartFactory } from 'test/factories/make-cart'
import { CartItemFactory } from 'test/factories/make-cart-item'
import { CategoryFactory } from 'test/factories/make-category'
import { ClientFactory } from 'test/factories/make-client'
import { DishFactory } from 'test/factories/make-dish'
import { DishAttachmentFactory } from 'test/factories/make-dish-attachment'
import { IngredientFactory } from 'test/factories/make-ingredient'

import { Slug } from '@/domain/restaurant/enterprise/entities/value-objects/slug'
import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'

describe('Get cart by id (E2E)', () => {
  let app: INestApplication
  let dishFactory: DishFactory
  let clientFactory: ClientFactory
  let cartFactory: CartFactory
  let cartItemFactory: CartItemFactory
  let attachmentFactory: AttachmentFactory
  let categoryFactory: CategoryFactory
  let dishAttachmentFactory: DishAttachmentFactory
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [
        ClientFactory,
        DishFactory,
        CartFactory,
        CartItemFactory,
        AttachmentFactory,
        CategoryFactory,
        IngredientFactory,
        DishAttachmentFactory,
      ],
    }).compile()

    app = moduleRef.createNestApplication()

    clientFactory = moduleRef.get(ClientFactory)
    dishFactory = moduleRef.get(DishFactory)
    cartFactory = moduleRef.get(CartFactory)
    cartItemFactory = moduleRef.get(CartItemFactory)
    categoryFactory = moduleRef.get(CategoryFactory)
    attachmentFactory = moduleRef.get(AttachmentFactory)
    dishAttachmentFactory = moduleRef.get(DishAttachmentFactory)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test('[GET] /carts/:id', async () => {
    const user = await clientFactory.makePrismaClient({
      name: 'John Doe',
    })

    const accessToken = jwt.sign({ sub: user.id.toString() })

    const category = await categoryFactory.makePrismaCategory()

    const dish = await dishFactory.makePrismaDish({
      name: 'Dish name',
      slug: Slug.create('dish-title'),
      categoryId: category.id,
    })

    const attachment = await attachmentFactory.makePrismaAttachment({
      title: 'Attachment title',
    })

    await dishAttachmentFactory.makePrismaDishAttachment({
      dishId: dish.id,
      attachmentId: attachment.id,
    })

    const cart = await cartFactory.makePrismaCart({
      clientId: user.id,
    })

    await cartItemFactory.makePrismaCartItem({
      cartId: cart.id,
      dishId: dish.id,
      quantity: 1,
    })

    const response = await request(app.getHttpServer())
      .get(`/cart/${cart.id.toString()}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual({
      cart: expect.objectContaining({
        cartId: cart.id.toString(),
        totalAmount: cart.totalAmount,

        dishes: expect.arrayContaining([
          expect.objectContaining({
            id: dish.id.toString(),
            name: dish.name,
            price: dish.price,
            slug: dish.slug.value,
            attachments: expect.arrayContaining([
              expect.objectContaining({
                id: attachment.id.toString(),
                title: attachment.title,
                url: attachment.url,
              }),
            ]),
            quantity: 1,
          }),
        ]),

        client: expect.objectContaining({
          id: user.id.toString(),
          name: user.name,
          email: user.email,
        }),
      }),
    })
  })
})
