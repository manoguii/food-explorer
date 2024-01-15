import { PaymentService } from '@/domain/restaurant/application/payment/payment-service'
import { Dish } from '@/domain/restaurant/enterprise/entities/dish'

export class InMemoryStripeApi implements PaymentService {
  async createCheckoutSession(
    lineItems: { dish: Dish; quantity: number }[],
  ): Promise<string> {
    return `checkout-session-id-${lineItems[0].dish.id.toString()}`
  }
}
