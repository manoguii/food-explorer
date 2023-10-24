import {
  BadRequestException,
  Controller,
  Delete,
  NotFoundException,
  Param,
} from '@nestjs/common'
import { DeleteCategoryUseCase } from '@/domain/restaurant/application/use-cases/delete-category'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { ApiTags } from '@nestjs/swagger'

@ApiTags('Categories')
@Controller('/categories/:categoryId')
export class DeleteCategoryController {
  constructor(private deleteCategory: DeleteCategoryUseCase) {}

  @Delete()
  async handle(@Param('categoryId') categoryId: string) {
    const result = await this.deleteCategory.execute({
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
