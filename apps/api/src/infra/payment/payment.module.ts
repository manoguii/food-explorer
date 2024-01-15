import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import {
  ConfigurableModuleClass,
  MODULE_OPTIONS_TOKEN,
} from './stripe/stripe.module-definition'
import { StripeService } from './stripe/stripe.service'
import { EnvModule } from '../env/env.module'
import { StripeApi } from './stripe/stripe-api'
import { PaymentService } from '@/domain/restaurant/application/payment/payment-service'

@Module({
  imports: [ConfigModule, EnvModule],
  providers: [
    StripeService,
    {
      provide: PaymentService,
      useClass: StripeApi,
    },
    {
      provide: MODULE_OPTIONS_TOKEN,
      useValue: ConfigurableModuleClass,
    },
  ],
  exports: [StripeService, PaymentService],
})
export class PaymentModule extends ConfigurableModuleClass {}
