import { Module } from '@nestjs/common'

import { CreateAccountController } from './controllers/create-account.controller'
import { DatabaseModule } from '../database/database.module'
import { CreateDishUseCase } from '@/domain/restaurant/application/use-cases/create-dish'
import { CryptographyModule } from '../cryptography/cryptography.module'
import { CreateDishController } from './controllers/create-dish.controller'
import { FetchRecentDishController } from './controllers/fetch-recent-dish.controller'
import { FetchRecentDishUseCase } from '@/domain/restaurant/application/use-cases/fetch-recent-dish'
import { RegisterClientUseCase } from '@/domain/restaurant/application/use-cases/register-client'
import { AuthenticateController } from './controllers/authenticate.controller'
import { AuthenticateClientUseCase } from '@/domain/restaurant/application/use-cases/authenticate-client'
import { CreateCategoryController } from './controllers/create-category.controller'
import { CreateCategoryUseCase } from '@/domain/restaurant/application/use-cases/create-category'

@Module({
  imports: [DatabaseModule, CryptographyModule],
  controllers: [
    CreateAccountController,
    CreateDishController,
    FetchRecentDishController,
    AuthenticateController,
    CreateCategoryController,
  ],
  providers: [
    CreateDishUseCase,
    FetchRecentDishUseCase,
    RegisterClientUseCase,
    AuthenticateClientUseCase,
    CreateCategoryUseCase,
  ],
})
export class HttpModule {}
