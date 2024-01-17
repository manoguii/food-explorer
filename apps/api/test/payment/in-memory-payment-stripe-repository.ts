import { StripeRepository } from '@/domain/restaurant/application/payment/stripe-repository'
import { CartWithDetailsProps } from '@/domain/restaurant/enterprise/entities/value-objects/cart-with-details'

export class InMemoryPaymentStripeRepository implements StripeRepository {
  async createCheckoutSession(
    cart: CartWithDetailsProps,
  ): Promise<string | null> {
    return `checkout-session-${cart.dishes[0].id}`
  }
}
