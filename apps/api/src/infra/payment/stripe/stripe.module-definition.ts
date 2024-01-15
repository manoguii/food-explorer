import { ConfigurableModuleBuilder } from '@nestjs/common'
import { PaymentModuleOptions } from './stripe-options.interface'

export const { ConfigurableModuleClass, MODULE_OPTIONS_TOKEN } =
  new ConfigurableModuleBuilder<PaymentModuleOptions>()
    .setClassMethodName('forRoot')
    .build()
