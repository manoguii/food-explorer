import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Entity } from '@/core/entities/entity'
import Stripe from 'stripe'
import { Optional } from '@/core/types/optional'

export interface WebhookEventProps {
  type: string
  data: Stripe.Event
  createdAt: Date
}

export class WebhookEvent extends Entity<WebhookEventProps> {
  get type() {
    return this.props.type
  }

  get data() {
    return this.props.data
  }

  get createdAt() {
    return this.props.createdAt
  }

  static create(
    props: Optional<WebhookEventProps, 'createdAt'>,
    id?: UniqueEntityID,
  ) {
    const webhookEvent = new WebhookEvent(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    )

    return webhookEvent
  }
}
