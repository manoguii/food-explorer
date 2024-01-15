import Stripe from 'stripe'

export abstract class PaymentModuleOptions {
  abstract apiKey: string
  abstract options: Stripe.StripeConfig
}
