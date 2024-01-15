import { CartWithDetailsProps } from '../../enterprise/entities/value-objects/cart-with-details'

export type LineItems = Pick<CartWithDetailsProps, 'dishes'>

export abstract class StripeRepository {
  abstract createCheckoutSession(lineItems: LineItems): Promise<string | null>
}
