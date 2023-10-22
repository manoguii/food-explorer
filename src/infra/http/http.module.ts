import { Module } from '@nestjs/common'

import { CreateAccountController } from './controllers/create-account.controller'
import { DatabaseModule } from '../database/database.module'
import { CreateDishUseCase } from '@/domain/restaurant/application/use-cases/create-dish'
import { CryptographyModule } from '../cryptography/cryptography.module'
import { CreateDishController } from './controllers/create-dish.controller'
import { FetchRecentDishController } from './controllers/fetch-recent-dish.controller'
import { FetchRecentDishUseCase } from '@/domain/restaurant/application/use-cases/fetch-recent-dish'
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
import { CreateOrderController } from './controllers/create-order.controller'
import { CreateOrderUseCase } from '@/domain/restaurant/application/use-cases/create-order'

@Module({
  imports: [DatabaseModule, CryptographyModule],
  controllers: [
    CreateAccountController,
    CreateDishController,
    FetchRecentDishController,
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
    CreateOrderController,
  ],
  providers: [
    CreateAccountUseCase,
    CreateDishUseCase,
    FetchRecentDishUseCase,
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
    CreateOrderUseCase,
  ],
})
export class HttpModule {}
