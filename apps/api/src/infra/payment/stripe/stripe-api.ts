import { Injectable } from '@nestjs/common'
import { StripeService } from './stripe.service'
import { Dish } from '@/domain/restaurant/enterprise/entities/dish'
import { PaymentService } from '@/domain/restaurant/application/payment/payment-service'

@Injectable()
export class StripeApi implements PaymentService {
  constructor(private readonly stripeService: StripeService) {}

  async createCheckoutSession(
    lineItems: { dish: Dish; quantity: number }[],
  ): Promise<string> {
    const session = await this.stripeService.stripe.checkout.sessions.create({
      payment_method_types: ['card', 'boleto'],
      mode: 'payment',
      success_url: 'http://localhost:3000/food/success',
      cancel_url: 'http://localhost:3000/food/cancel',
      line_items: lineItems.map((lineItem) => ({
        price_data: {
          currency: 'brl',
          product_data: {
            name: lineItem.dish.name,
            description: lineItem.dish.description,
            // images: [lineItem.dish.image],
          },
          unit_amount: lineItem.dish.price * 100,
        },
        quantity: lineItem.quantity,
      })),
    })
    return session.id
  }
}
