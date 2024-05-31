import { Injectable } from '@nestjs/common'

import { WebhookEventRepository } from '@/domain/restaurant/application/payment/webhook-event'
import { WebhookEvent } from '@/domain/restaurant/enterprise/entities/webhook-event'

import { PrismaService } from '../prisma.service'

@Injectable()
export class PrismaWebhookEventRepository implements WebhookEventRepository {
  constructor(private prisma: PrismaService) {}

  async create(webhookEvent: WebhookEvent): Promise<void> {
    await this.prisma.webhookEvent.create({
      data: {
        data: JSON.parse(JSON.stringify(webhookEvent.data)),
        type: webhookEvent.type,
      },
    })
  }
}
