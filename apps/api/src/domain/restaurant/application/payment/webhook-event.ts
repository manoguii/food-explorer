import { WebhookEvent } from '../../enterprise/entities/webhook-event'

export abstract class WebhookEventRepository {
  abstract create(webhookEvent: WebhookEvent): Promise<void>
}
