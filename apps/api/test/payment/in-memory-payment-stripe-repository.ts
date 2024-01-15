import {
  LineItems,
  StripeRepository,
} from '@/domain/restaurant/application/payment/stripe-repository'

export class InMemoryPaymentStripeRepository implements StripeRepository {
  async createCheckoutSession({ dishes }: LineItems): Promise<string> {
    return `checkout-session-id-${dishes[0].id}`
  }
}
