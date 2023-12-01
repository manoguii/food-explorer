import { BadRequestException, Body, Controller, Post } from '@nestjs/common'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { z } from 'zod'
import { CreateCategoryUseCase } from '@/domain/restaurant/application/use-cases/create-category'
import { ConflictExceptionError } from '@/domain/restaurant/application/use-cases/errors/conflict-exception-error'
import { ApiTags } from '@nestjs/swagger'
import { CategoryPresenter } from '../presenters/category-presenter'
import { Role } from '@/infra/auth/roles-enum'
import { Roles } from '@/infra/auth/roles-decorator'

const createCategoryBodySchema = z.object({
  name: z.string(),
})

const bodyValidationPipe = new ZodValidationPipe(createCategoryBodySchema)

type CreateCategoryBodySchema = z.infer<typeof createCategoryBodySchema>

@ApiTags('Categories')
@Controller('/categories')
export class CreateCategoryController {
  constructor(private createCategory: CreateCategoryUseCase) {}

  @Roles(Role.ADMIN)
  @Post()
  async handle(@Body(bodyValidationPipe) body: CreateCategoryBodySchema) {
    const { name } = body

    const result = await this.createCategory.execute({
      name,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case ConflictExceptionError:
          throw new BadRequestException(error.message)
        default:
      }
    }

    const category = result.isRight() ? result.value.category : null

    if (!category) {
      throw new BadRequestException('Something went wrong')
    }

    return {
      category: CategoryPresenter.toHTTP(category),
    }
  }
}
