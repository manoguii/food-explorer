import { BadRequestException, Controller, Post, Req } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import Stripe from 'stripe'

import { StripeWebhookUseCase } from '@/domain/restaurant/application/webhooks/stripe-webhook'
import { Public } from '@/infra/auth/public'
import { EnvService } from '@/infra/env/env.service'
import { StripeService } from '@/infra/payment/stripe/stripe.service'

@ApiTags('Webhooks')
@Controller('/webhook')
@Public()
export class StripeWebhookController {
  constructor(
    private stripeWebhookUseCase: StripeWebhookUseCase,
    private envService: EnvService,
    private stripeService: StripeService,
  ) {}

  @Post()
  async handle(@Req() req: Request & { rawBody: Buffer }) {
    let event: Stripe.Event
    const signature = req.headers['stripe-signature']

    try {
      event = this.stripeService.stripe.webhooks.constructEvent(
        req.rawBody,
        signature,
        this.envService.get('STRIPE_WEBHOOK_SECRET'),
      )
    } catch (err) {
      throw new BadRequestException('Invalid Stripe webhook signature')
    }

    await this.stripeWebhookUseCase.execute({
      event,
    })

    // if (result.isLeft()) {
    //   const error = result.value

    //   switch (error.constructor) {
    //     case InvalidEventError:
    //       throw new BadRequestException(error.message)
    //     default:
    //       throw new BadRequestException(error.message)
    //   }
    // }
  }
}
