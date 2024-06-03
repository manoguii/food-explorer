import { Module } from '@nestjs/common'

import { AddDishToCartUseCase } from '@/domain/restaurant/application/use-cases/add-dish-to-cart'
import { AuthenticateClientUseCase } from '@/domain/restaurant/application/use-cases/authenticate-client'
import { ChooseDishAsFavoriteUseCase } from '@/domain/restaurant/application/use-cases/choose-dish-as-favorite'
import { CreateCartUseCase } from '@/domain/restaurant/application/use-cases/create-cart'
import { CreateCategoryUseCase } from '@/domain/restaurant/application/use-cases/create-category'
import { CreateCheckoutSessionUseCase } from '@/domain/restaurant/application/use-cases/create-checkout-session'
import { CreateDishUseCase } from '@/domain/restaurant/application/use-cases/create-dish'
import { DeleteCategoryUseCase } from '@/domain/restaurant/application/use-cases/delete-category'
import { DeleteDishUseCase } from '@/domain/restaurant/application/use-cases/delete-dish'
import { DeleteDishFromFavoritesUseCase } from '@/domain/restaurant/application/use-cases/delete-dish-from-favorites'
import { DeleteDishToCartUseCase } from '@/domain/restaurant/application/use-cases/delete-dish-to-cart'
import { EditCartUseCase } from '@/domain/restaurant/application/use-cases/edit-cart'
import { EditCategoryUseCase } from '@/domain/restaurant/application/use-cases/edit-category'
import { EditDishUseCase } from '@/domain/restaurant/application/use-cases/edit-dish'
import { FetchCategoriesUseCase } from '@/domain/restaurant/application/use-cases/fetch-categories'
import { FetchDishesByCategoryUseCase } from '@/domain/restaurant/application/use-cases/fetch-dishes-by-category'
import { FetchFavoriteDishesUseCase } from '@/domain/restaurant/application/use-cases/fetch-favorite-dishes'
import { FetchFilteredDishesUseCase } from '@/domain/restaurant/application/use-cases/fetch-filtered-dishes'
import { FetchOrdersUseCase } from '@/domain/restaurant/application/use-cases/fetch-orders'
import { GetCartByIdUseCase } from '@/domain/restaurant/application/use-cases/get-cart-by-id'
import { GetDashboardMetricsUseCase } from '@/domain/restaurant/application/use-cases/get-dashboard-metrics'
import { GetDishBySlugUseCase } from '@/domain/restaurant/application/use-cases/get-dish-by-slug'
import { GetOrderByIdUseCase } from '@/domain/restaurant/application/use-cases/get-order-by-id'
import { CreateAccountUseCase } from '@/domain/restaurant/application/use-cases/register-client'
import { UploadAndCreateAttachmentsUseCase } from '@/domain/restaurant/application/use-cases/upload-and-create-attachment'
import { StripeWebhookUseCase } from '@/domain/restaurant/application/webhooks/stripe-webhook'

import { CryptographyModule } from '../cryptography/cryptography.module'
import { DatabaseModule } from '../database/database.module'
import { EnvModule } from '../env/env.module'
import { EnvService } from '../env/env.service'
import { PaymentModule } from '../payment/payment.module'
import { AccountController } from './controllers/account/account.controller'
import { AttachmentController } from './controllers/attachment/attachment.controller'
import { CartController } from './controllers/cart/cart.controller'
import { CategoryController } from './controllers/category/category.controller'
import { CheckoutController } from './controllers/checkout/checkout.controller'
import { DishController } from './controllers/dish/dish.controller'
import { FavoriteController } from './controllers/favorite/favorite.controller'
import { MetricsController } from './controllers/metric/metrics.controller'
import { OrderController } from './controllers/order/order.controller'
import { SessionController } from './controllers/session/session.controller'
import { WebhookController } from './controllers/webhook/webhook.controller'

@Module({
  imports: [
    EnvModule,
    DatabaseModule,
    CryptographyModule,
    PaymentModule.forRootAsync({
      inject: [EnvService],

      useFactory: (envService: EnvService) => {
        const apiKey = envService.get('STRIPE_API_SECRET_KEY')

        return {
          apiKey,
          options: {
            apiVersion: '2023-10-16',
          },
        }
      },
    }),
  ],
  controllers: [
    DishController,
    FavoriteController,
    CategoryController,
    CartController,
    OrderController,
    MetricsController,
    AttachmentController,
    CheckoutController,
    AccountController,
    SessionController,

    WebhookController,
  ],
  providers: [
    CreateAccountUseCase,
    CreateDishUseCase,
    AuthenticateClientUseCase,
    CreateCategoryUseCase,
    GetDishBySlugUseCase,
    UploadAndCreateAttachmentsUseCase,
    EditDishUseCase,
    ChooseDishAsFavoriteUseCase,
    DeleteCategoryUseCase,
    DeleteDishUseCase,
    EditCategoryUseCase,
    FetchFavoriteDishesUseCase,
    CreateCartUseCase,
    EditCartUseCase,
    FetchDishesByCategoryUseCase,
    FetchCategoriesUseCase,
    FetchFilteredDishesUseCase,
    DeleteDishFromFavoritesUseCase,
    GetCartByIdUseCase,
    AddDishToCartUseCase,
    DeleteDishToCartUseCase,
    CreateCheckoutSessionUseCase,
    FetchOrdersUseCase,
    GetOrderByIdUseCase,
    GetDashboardMetricsUseCase,

    StripeWebhookUseCase,
  ],
})
export class HttpModule {}
