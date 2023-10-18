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
  ],
  providers: [
    CreateAccountUseCase,
    CreateDishUseCase,
    FetchRecentDishUseCase,
    AuthenticateClientUseCase,
    CreateCategoryUseCase,
    GetDishBySlugUseCase,
    UploadAndCreateAttachmentsUseCase,
  ],
})
export class HttpModule {}
