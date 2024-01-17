import { Module } from '@nestjs/common'
import { PrismaService } from './prisma/prisma.service'
import { DishRepository } from '@/domain/restaurant/application/repositories/dish-repository'
import { PrismaDishRepository } from './prisma/repositories/prisma-dish-repository'
import { ClientsRepository } from '@/domain/restaurant/application/repositories/clients-repository'
import { PrismaClientsRepository } from './prisma/repositories/prisma-client-repository'
import { CategoryRepository } from '@/domain/restaurant/application/repositories/category-repository'
import { PrismaCategoryRepository } from './prisma/repositories/prisma-category-repository'
import { AttachmentsRepository } from '@/domain/restaurant/application/repositories/attachments-repository'
import { PrismaAttachmentsRepository } from './prisma/repositories/prisma-attachments-repository'
import { Uploader } from '@/domain/restaurant/application/storage/uploader'
import { R2Storage } from '../storage/r2-storage'
import { EnvModule } from '../env/env.module'
import { DishAttachmentsRepository } from '@/domain/restaurant/application/repositories/dish-attachments-repository'
import { PrismaDishAttachmentsRepository } from './prisma/repositories/prisma-dish-attachments-repository'
import { PrismaDishIngredientsRepository } from './prisma/repositories/prisma-dish-ingredient-repository'
import { DishIngredientsRepository } from '@/domain/restaurant/application/repositories/dish-ingredients-repository'
import { FavoriteDishRepository } from '@/domain/restaurant/application/repositories/favorite-dish-repository'
import { PrismaFavoriteDishRepository } from './prisma/repositories/prisma-favorite-dish-repository'
import { CartRepository } from '@/domain/restaurant/application/repositories/cart-repository'
import { PrismaCartRepository } from './prisma/repositories/prisma-cart-repository'
import { CartItemsRepository } from '@/domain/restaurant/application/repositories/cart-item-repository'
import { PrismaCartItemsRepository } from './prisma/repositories/prisma-cart-item-repository'
import { PrismaOrderRepository } from './prisma/repositories/prisma-order-repository'
import { OrderRepository } from '@/domain/restaurant/application/repositories/orders-repository'
import { PrismaWebhookEventRepository } from './prisma/repositories/prisma-webhook-event-repository'
import { WebhookEventRepository } from '@/domain/restaurant/application/payment/webhook-event'

@Module({
  imports: [EnvModule],
  providers: [
    PrismaService,
    {
      provide: DishRepository,
      useClass: PrismaDishRepository,
    },
    {
      provide: ClientsRepository,
      useClass: PrismaClientsRepository,
    },
    {
      provide: CategoryRepository,
      useClass: PrismaCategoryRepository,
    },
    {
      provide: AttachmentsRepository,
      useClass: PrismaAttachmentsRepository,
    },
    {
      provide: DishAttachmentsRepository,
      useClass: PrismaDishAttachmentsRepository,
    },
    {
      provide: DishIngredientsRepository,
      useClass: PrismaDishIngredientsRepository,
    },
    {
      provide: FavoriteDishRepository,
      useClass: PrismaFavoriteDishRepository,
    },
    {
      provide: CartRepository,
      useClass: PrismaCartRepository,
    },
    {
      provide: CartItemsRepository,
      useClass: PrismaCartItemsRepository,
    },
    {
      provide: Uploader,
      useClass: R2Storage,
    },
    {
      provide: OrderRepository,
      useClass: PrismaOrderRepository,
    },
    {
      provide: WebhookEventRepository,
      useClass: PrismaWebhookEventRepository,
    },
  ],
  exports: [
    PrismaService,
    DishRepository,
    ClientsRepository,
    CategoryRepository,
    AttachmentsRepository,
    Uploader,
    DishAttachmentsRepository,
    DishIngredientsRepository,
    FavoriteDishRepository,
    CartRepository,
    CartItemsRepository,
    OrderRepository,
    WebhookEventRepository,
  ],
})
export class DatabaseModule {}
