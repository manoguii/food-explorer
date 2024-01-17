import { Either, right } from '@/core/either'
import { CartRepository } from '../repositories/cart-repository'
import { Injectable } from '@nestjs/common'
import { ClientsRepository } from '../repositories/clients-repository'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import Stripe from 'stripe'
import { StripeRepository } from '../payment/stripe-repository'

interface StripeWebhookUseCaseRequest {
  event: Stripe.Event
}

type StripeWebhookUseCaseResponse = Either<ResourceNotFoundError, null>

@Injectable()
export class StripeWebhookUseCase {
  constructor(
    private cartRepository: CartRepository,
    private clientsRepository: ClientsRepository,
    private stripeRepository: StripeRepository,
  ) {}

  async execute({
    event,
  }: StripeWebhookUseCaseRequest): Promise<StripeWebhookUseCaseResponse> {
    if (event.type === 'checkout.session.completed') {
      // Create order
    }

    return right(null)
  }
}
