import { Either, left, right } from '@/core/either'
import { CartRepository } from '../repositories/cart-repository'
import { Injectable } from '@nestjs/common'
import { Order, PaymentStatus } from '../../enterprise/entities/order'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { CartIdNotProvidedError } from './errors/cart-id-not-provided-error'
import { CartNotFoundError } from './errors/cart-not-found-error'
import { OrderRepository } from '../repositories/orders-repository'
import { WebhookEvent } from '../../enterprise/entities/webhook-event'
import { WebhookEventRepository } from '../payment/webhook-event'
import Stripe from 'stripe'

interface StripeWebhookUseCaseRequest {
  event: Stripe.Event
}

type StripeWebhookUseCaseResponse = Either<
  CartIdNotProvidedError | CartNotFoundError,
  null
>

@Injectable()
export class StripeWebhookUseCase {
  constructor(
    private cartRepository: CartRepository,
    private webhookEventRepository: WebhookEventRepository,
    private orderRepository: OrderRepository,
  ) {}

  async execute({
    event,
  }: StripeWebhookUseCaseRequest): Promise<StripeWebhookUseCaseResponse> {
    if (event.type === 'checkout.session.completed') {
      if (!event.data.object.client_reference_id) {
        return left(new CartIdNotProvidedError())
      }

      const cart = await this.cartRepository.findById(
        event.data.object.client_reference_id,
      )

      if (!cart) {
        return left(new CartNotFoundError())
      }

      const order = Order.create({
        clientId: cart.clientId,
        cartId: new UniqueEntityID(event.data.object.client_reference_id),
        sessionId: new UniqueEntityID(event.data.object.id),
        currency: event.data.object.currency ?? 'brl',
        paymentMethod: event.data.object.payment_method_types[0],
        amountTotal: event.data.object.amount_total
          ? event.data.object.amount_total / 100
          : cart.totalAmount,
        paymentStatus:
          event.data.object.payment_status.toLocaleUpperCase() as PaymentStatus,
      })

      await this.orderRepository.create(order)
    }

    const webhookEvent = WebhookEvent.create({
      type: event.type,
      data: event,
    })

    await this.webhookEventRepository.create(webhookEvent)

    return right(null)
  }
}
