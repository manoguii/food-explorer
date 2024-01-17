import { CartWithDetailsProps } from '../../enterprise/entities/value-objects/cart-with-details'

export abstract class StripeRepository {
  abstract createCheckoutSession(
    cart: CartWithDetailsProps,
  ): Promise<string | null>
}
