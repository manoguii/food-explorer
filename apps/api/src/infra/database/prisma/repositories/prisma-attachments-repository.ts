import { Injectable } from '@nestjs/common'

import { AttachmentsRepository } from '@/domain/restaurant/application/repositories/attachments-repository'
import { Attachment } from '@/domain/restaurant/enterprise/entities/attachment'

import { PrismaAttachmentMapper } from '../mappers/prisma-attachment-mapper'
import { PrismaService } from '../prisma.service'

@Injectable()
export class PrismaAttachmentsRepository implements AttachmentsRepository {
  constructor(private prisma: PrismaService) {}

  async create(attachment: Attachment): Promise<void> {
    const data = PrismaAttachmentMapper.toPrisma(attachment)

    await this.prisma.attachment.create({
      data,
    })
  }
}
