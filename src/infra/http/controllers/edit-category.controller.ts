import {
  BadRequestException,
  Body,
  Controller,
  Param,
  Patch,
} from '@nestjs/common'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { z } from 'zod'
import { EditCategoryUseCase } from '@/domain/restaurant/application/use-cases/edit-category'

const editCategoryBodySchema = z.object({
  name: z.string(),
})

const bodyValidationPipe = new ZodValidationPipe(editCategoryBodySchema)

type EditCategoryBodySchema = z.infer<typeof editCategoryBodySchema>

@Controller('/categories/:categoryId')
export class EditCategoryController {
  constructor(private editCategory: EditCategoryUseCase) {}

  @Patch()
  async handle(
    @Body(bodyValidationPipe) body: EditCategoryBodySchema,
    @CurrentUser() user: UserPayload,
    @Param('categoryId') categoryId: string,
  ) {
    const { name } = body

    const userId = user.sub

    const result = await this.editCategory.execute({
      name,
      categoryId,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}
