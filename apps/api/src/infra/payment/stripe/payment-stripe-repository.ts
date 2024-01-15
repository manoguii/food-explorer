import { Injectable } from '@nestjs/common'
import { StripeService } from './stripe.service'
import {
  LineItems,
  StripeRepository,
} from '@/domain/restaurant/application/payment/stripe-repository'
import { EnvService } from '@/infra/env/env.service'

@Injectable()
export class PaymentStripeRepository implements StripeRepository {
  constructor(
    private stripeService: StripeService,
    private envService: EnvService,
  ) {}

  async createCheckoutSession({ dishes }: LineItems): Promise<string | null> {
    const session = await this.stripeService.stripe.checkout.sessions.create({
      payment_method_types: ['card', 'boleto'],
      mode: 'payment',
      success_url: this.envService.get('STRIPE_SUCCESS_URL'),
      cancel_url: this.envService.get('STRIPE_CANCEL_URL'),
      line_items: dishes.map((dish) => ({
        price_data: {
          currency: 'brl',
          product_data: {
            name: dish.name,
            description: dish.description,
            images: dish.attachments.map((attachment) => {
              const imageUrl = `${this.envService.get('CLOUDFLARE_BASE_URL')}/${attachment.url}`

              return imageUrl
            }),
          },
          unit_amount: dish.price * 100,
        },
        quantity: dish.quantity,
      })),
    })

    return session.url
  }
}
