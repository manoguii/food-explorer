import { AttachmentsRepository } from '@/domain/restaurant/application/repositories/attachments-repository'
import { Attachment } from '@/domain/restaurant/enterprise/entities/attachment'

export class InMemoryAttachmentsRepository implements AttachmentsRepository {
  public items: Attachment[] = []

  async create(attachment: Attachment): Promise<void> {
    this.items.push(attachment)
  }
}
