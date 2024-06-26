import {
  BadRequestException,
  Controller,
  FileTypeValidator,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { ApiTags } from '@nestjs/swagger'

import { InvalidAttachmentTypeError } from '@/domain/restaurant/application/use-cases/errors/invalid-attachment-type-error'
import { UploadAndCreateAttachmentsUseCase } from '@/domain/restaurant/application/use-cases/upload-and-create-attachment'

@ApiTags('Attachments')
@Controller('/attachments')
export class AttachmentController {
  constructor(
    private uploadAndCreateAttachment: UploadAndCreateAttachmentsUseCase,
  ) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async upload(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({
            maxSize: 1024 * 1024 * 6, // 2MB
          }),
          new FileTypeValidator({ fileType: '.(png|jpg|jpeg)' }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    const result = await this.uploadAndCreateAttachment.execute({
      body: file.buffer,
      fileName: file.originalname,
      fileType: file.mimetype,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case InvalidAttachmentTypeError:
          throw new BadRequestException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }

    const { attachment } = result.value

    return {
      attachmentId: attachment.id.toString(),
    }
  }
}
