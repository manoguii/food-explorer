import { Injectable } from '@nestjs/common'

import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'

import { StripeRepository } from '../payment/stripe-repository'
import { CartRepository } from '../repositories/cart-repository'
import { FailedToCreateACheckoutSessionError } from './errors/failed-to-create-a-checkout-session-error'

interface CreateCheckoutSessionUseCaseRequest {
  cartId: string
}

type CreateCheckoutSessionUseCaseResponse = Either<
  ResourceNotFoundError | FailedToCreateACheckoutSessionError,
  {
    checkoutSessionUrl: string
  }
>

@Injectable()
export class CreateCheckoutSessionUseCase {
  constructor(
    private cartRepository: CartRepository,
    private paymentStripeRepository: StripeRepository,
  ) {}

  async execute({
    cartId,
  }: CreateCheckoutSessionUseCaseRequest): Promise<CreateCheckoutSessionUseCaseResponse> {
    const cart = await this.cartRepository.findByIdWithDetails(cartId)

    if (!cart) {
      return left(new ResourceNotFoundError())
    }

    const checkoutSessionUrl =
      await this.paymentStripeRepository.createCheckoutSession(cart)

    if (!checkoutSessionUrl) {
      return left(
        new FailedToCreateACheckoutSessionError(cart.cartId.toString()),
      )
    }

    return right({
      checkoutSessionUrl,
    })
  }
}
