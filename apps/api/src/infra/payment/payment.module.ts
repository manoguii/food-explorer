import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import { StripeRepository } from '@/domain/restaurant/application/payment/stripe-repository'

import { EnvModule } from '../env/env.module'
import { PaymentStripeRepository } from './stripe/payment-stripe-repository'
import {
  ConfigurableModuleClass,
  MODULE_OPTIONS_TOKEN,
} from './stripe/stripe.module-definition'
import { StripeService } from './stripe/stripe.service'

@Module({
  imports: [ConfigModule, EnvModule],
  providers: [
    StripeService,
    {
      provide: StripeRepository,
      useClass: PaymentStripeRepository,
    },
    {
      provide: MODULE_OPTIONS_TOKEN,
      useValue: ConfigurableModuleClass,
    },
  ],
  exports: [StripeService, StripeRepository],
})
export class PaymentModule extends ConfigurableModuleClass {}
