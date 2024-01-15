import { Dish } from '../../enterprise/entities/dish'

export abstract class PaymentService {
  abstract createCheckoutSession(
    lineItems: {
      dish: Dish
      quantity: number
    }[],
  ): Promise<string>
}
