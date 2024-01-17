import { Injectable } from '@nestjs/common'
import { StripeService } from './stripe.service'
import { StripeRepository } from '@/domain/restaurant/application/payment/stripe-repository'
import { EnvService } from '@/infra/env/env.service'
import { CartWithDetailsProps } from '@/domain/restaurant/enterprise/entities/value-objects/cart-with-details'

@Injectable()
export class PaymentStripeRepository implements StripeRepository {
  constructor(
    private stripeService: StripeService,
    private envService: EnvService,
  ) {}

  async createCheckoutSession(
    cart: CartWithDetailsProps,
  ): Promise<string | null> {
    const session = await this.stripeService.stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      success_url: this.envService.get('STRIPE_SUCCESS_URL'),
      cancel_url: this.envService.get('STRIPE_CANCEL_URL'),
      client_reference_id: cart.cartId.toString(),
      line_items: cart.dishes.map((dish) => ({
        quantity: dish.quantity,
        price_data: {
          unit_amount: dish.price * 100,
          currency: 'brl',
          product_data: {
            name: dish.name,
            description: dish.description,
            images: dish.attachments.map((attachment) => {
              const imageUrl = `${this.envService.get('CLOUDFLARE_BASE_URL')}/${attachment.url}`

              return imageUrl
            }),
          },
        },
      })),
    })

    return session.url
  }
}
