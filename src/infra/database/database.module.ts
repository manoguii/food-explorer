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
      provide: Uploader,
      useClass: R2Storage,
    },
  ],
  exports: [
    PrismaService,
    DishRepository,
    ClientsRepository,
    CategoryRepository,
    AttachmentsRepository,
    Uploader,
  ],
})
export class DatabaseModule {}
