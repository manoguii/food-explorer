import {
  BadRequestException,
  Body,
  Controller,
  NotFoundException,
  Param,
  Patch,
} from '@nestjs/common'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { z } from 'zod'
import { EditCategoryUseCase } from '@/domain/restaurant/application/use-cases/edit-category'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { ApiTags } from '@nestjs/swagger'
import { Role } from '@/infra/auth/roles-enum'
import { Roles } from '@/infra/auth/roles-decorator'

const editCategoryBodySchema = z.object({
  name: z.string(),
})

const bodyValidationPipe = new ZodValidationPipe(editCategoryBodySchema)

type EditCategoryBodySchema = z.infer<typeof editCategoryBodySchema>

@ApiTags('Categories')
@Controller('/categories/:categoryId')
export class EditCategoryController {
  constructor(private editCategory: EditCategoryUseCase) {}

  @Roles(Role.ADMIN)
  @Patch()
  async handle(
    @Body(bodyValidationPipe) body: EditCategoryBodySchema,
    @Param('categoryId') categoryId: string,
  ) {
    const { name } = body

    const result = await this.editCategory.execute({
      name,
      categoryId,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case ResourceNotFoundError:
          throw new NotFoundException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }
  }
}
