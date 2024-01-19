import { Module } from '@nestjs/common'

import { CreateAccountController } from './controllers/create-account.controller'
import { DatabaseModule } from '../database/database.module'
import { CreateDishUseCase } from '@/domain/restaurant/application/use-cases/create-dish'
import { CryptographyModule } from '../cryptography/cryptography.module'
import { CreateDishController } from './controllers/create-dish.controller'
import { CreateAccountUseCase } from '@/domain/restaurant/application/use-cases/register-client'
import { AuthenticateController } from './controllers/authenticate.controller'
import { AuthenticateClientUseCase } from '@/domain/restaurant/application/use-cases/authenticate-client'
import { CreateCategoryController } from './controllers/create-category.controller'
import { CreateCategoryUseCase } from '@/domain/restaurant/application/use-cases/create-category'
import { GetDishBySlugUseCase } from '@/domain/restaurant/application/use-cases/get-dish-by-slug'
import { GetDishBySlugController } from './controllers/get-dish-by-slug.controller'
import { UploadAttachmentController } from './controllers/upload-attachment.controller'
import { UploadAndCreateAttachmentsUseCase } from '@/domain/restaurant/application/use-cases/upload-and-create-attachment'
import { EditDishUseCase } from '@/domain/restaurant/application/use-cases/edit-dish'
import { EditDishController } from './controllers/edit-dish.controller'
import { ChooseDishAsFavoriteController } from './controllers/choose-dish-as-favorite.controller'
import { ChooseDishAsFavoriteUseCase } from '@/domain/restaurant/application/use-cases/choose-dish-as-favorite'
import { DeleteCategoryController } from './controllers/delete-category.controller'
import { DeleteCategoryUseCase } from '@/domain/restaurant/application/use-cases/delete-category'
import { DeleteDishController } from './controllers/delete-dish.controller'
import { DeleteDishUseCase } from '@/domain/restaurant/application/use-cases/delete-dish'
import { EditCategoryController } from './controllers/edit-category.controller'
import { EditCategoryUseCase } from '@/domain/restaurant/application/use-cases/edit-category'
import { FetchFavoriteDishesController } from './controllers/fetch-favorite-dishes.controller'
import { FetchFavoriteDishesUseCase } from '@/domain/restaurant/application/use-cases/fetch-favorite-dishes'
import { CreateCartController } from './controllers/create-cart.controller'
import { CreateCartUseCase } from '@/domain/restaurant/application/use-cases/create-cart'
import { EditCartController } from './controllers/edit-cart.controller'

import { FetchCategoriesController } from './controllers/fetch-categories.controller'
import { FetchCategoriesUseCase } from '@/domain/restaurant/application/use-cases/fetch-categories'
import { FetchFilteredDishesController } from './controllers/fetch-filtered-dishes.controller'
import { FetchFilteredDishesUseCase } from '@/domain/restaurant/application/use-cases/fetch-filtered-dishes'
import { FetchDishesByCategoryController } from './controllers/fetch-dishes-by-category.controller'
import { FetchDishesByCategoryUseCase } from '@/domain/restaurant/application/use-cases/fetch-dishes-by-category'
import { DeleteDishFromFavoritesUseCase } from '@/domain/restaurant/application/use-cases/delete-dish-from-favorites'
import { DeleteDishFromFavoritesController } from './controllers/delete-dish-from-favorites.controller'
import { GetCartByIdController } from './controllers/get-cart-by-id.controller'
import { GetCartByIdUseCase } from '@/domain/restaurant/application/use-cases/get-cart-by-id'
import { EditCartUseCase } from '@/domain/restaurant/application/use-cases/edit-cart'
import { AddDishToCartController } from './controllers/add-dish-to-cart.controller'
import { AddDishToCartUseCase } from '@/domain/restaurant/application/use-cases/add-dish-to-cart'
import { DeleteDishToCartUseCase } from '@/domain/restaurant/application/use-cases/delete-dish-to-cart'
import { DeleteDishToCartController } from './controllers/delete-dish-to-cart.controller'
import { PaymentModule } from '../payment/payment.module'
import { CreateCheckoutSessionController } from './controllers/create-checkout-session.controller'
import { CreateCheckoutSessionUseCase } from '@/domain/restaurant/application/use-cases/create-checkout-session'
import { EnvService } from '../env/env.service'
import { StripeWebhookController } from './webhooks/stripe-webhook.controller'
import { StripeWebhookUseCase } from '@/domain/restaurant/application/webhooks/stripe-webhook'
import { EnvModule } from '../env/env.module'
import { FetchOrdersController } from './controllers/fetch-orders.controller'
import { FetchOrdersUseCase } from '@/domain/restaurant/application/use-cases/fetch-orders'

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
  ],
})
export class HttpModule {}
