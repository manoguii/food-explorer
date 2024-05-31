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
import { AddDishToCartController } from './controllers/add-dish-to-cart.controller'
import { AuthenticateController } from './controllers/authenticate.controller'
import { ChooseDishAsFavoriteController } from './controllers/choose-dish-as-favorite.controller'
import { CreateAccountController } from './controllers/create-account.controller'
import { CreateCartController } from './controllers/create-cart.controller'
import { CreateCategoryController } from './controllers/create-category.controller'
import { CreateCheckoutSessionController } from './controllers/create-checkout-session.controller'
import { CreateDishController } from './controllers/create-dish.controller'
import { DeleteCategoryController } from './controllers/delete-category.controller'
import { DeleteDishController } from './controllers/delete-dish.controller'
import { DeleteDishFromFavoritesController } from './controllers/delete-dish-from-favorites.controller'
import { DeleteDishToCartController } from './controllers/delete-dish-to-cart.controller'
import { EditCartController } from './controllers/edit-cart.controller'
import { EditCategoryController } from './controllers/edit-category.controller'
import { EditDishController } from './controllers/edit-dish.controller'
import { FetchCategoriesController } from './controllers/fetch-categories.controller'
import { FetchDishesByCategoryController } from './controllers/fetch-dishes-by-category.controller'
import { FetchFavoriteDishesController } from './controllers/fetch-favorite-dishes.controller'
import { FetchFilteredDishesController } from './controllers/fetch-filtered-dishes.controller'
import { FetchOrdersController } from './controllers/fetch-orders.controller'
import { GetCartByIdController } from './controllers/get-cart-by-id.controller'
import { GetDashboardMetricsController } from './controllers/get-dashboard-metrics.controller'
import { GetDishBySlugController } from './controllers/get-dish-by-slug.controller'
import { GetOrderByIdController } from './controllers/get-order-by-id.controller'
import { UploadAttachmentController } from './controllers/upload-attachment.controller'
import { StripeWebhookController } from './webhooks/stripe-webhook.controller'

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
    CreateAccountController,
    CreateDishController,
    AuthenticateController,
    CreateCategoryController,
    GetDishBySlugController,
    UploadAttachmentController,
    EditDishController,
    ChooseDishAsFavoriteController,
    DeleteCategoryController,
    DeleteDishController,
    EditCategoryController,
    FetchFavoriteDishesController,
    CreateCartController,
    EditCartController,
    FetchDishesByCategoryController,
    FetchCategoriesController,
    FetchFilteredDishesController,
    DeleteDishFromFavoritesController,
    GetCartByIdController,
    AddDishToCartController,
    DeleteDishToCartController,
    CreateCheckoutSessionController,
    StripeWebhookController,
    FetchOrdersController,
    GetOrderByIdController,
    GetDashboardMetricsController,
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
    StripeWebhookUseCase,
    FetchOrdersUseCase,
    GetOrderByIdUseCase,
    GetDashboardMetricsUseCase,
  ],
})
export class HttpModule {}
