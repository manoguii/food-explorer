import { BadRequestException, Body, Controller, Post } from '@nestjs/common'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { z } from 'zod'
import { CreateCategoryUseCase } from '@/domain/restaurant/application/use-cases/create-category'

const createCategoryBodySchema = z.object({
  name: z.string(),
})

const bodyValidationPipe = new ZodValidationPipe(createCategoryBodySchema)

type CreateCategoryBodySchema = z.infer<typeof createCategoryBodySchema>

@Controller('/categories')
export class CreateCategoryController {
  constructor(private createCategory: CreateCategoryUseCase) {}

  @Post()
  async handle(
    @Body(bodyValidationPipe) body: CreateCategoryBodySchema,
    @CurrentUser() user: UserPayload,
  ) {
    const { name } = body
    const userId = user.sub

    const result = await this.createCategory.execute({
      name,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}
