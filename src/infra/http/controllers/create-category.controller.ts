import {
  BadRequestException,
  Body,
  Controller,
  Post,
  UnauthorizedException,
} from '@nestjs/common'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { z } from 'zod'
import { CreateCategoryUseCase } from '@/domain/restaurant/application/use-cases/create-category'
import { ConflictExceptionError } from '@/domain/restaurant/application/use-cases/errors/conflict-exception-error'
import { ApiTags } from '@nestjs/swagger'

const createCategoryBodySchema = z.object({
  name: z.string(),
})

const bodyValidationPipe = new ZodValidationPipe(createCategoryBodySchema)

type CreateCategoryBodySchema = z.infer<typeof createCategoryBodySchema>

@ApiTags('Categories')
@Controller('/categories')
export class CreateCategoryController {
  constructor(private createCategory: CreateCategoryUseCase) {}

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
          throw new UnauthorizedException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }
  }
}
