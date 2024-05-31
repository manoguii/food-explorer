import {
  BadRequestException,
  Controller,
  Delete,
  NotFoundException,
  Param,
} from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'

import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { DeleteCategoryUseCase } from '@/domain/restaurant/application/use-cases/delete-category'
import { Roles } from '@/infra/auth/roles-decorator'
import { Role } from '@/infra/auth/roles-enum'

@ApiTags('Categories')
@Controller('/categories/:categoryId')
export class DeleteCategoryController {
  constructor(private deleteCategory: DeleteCategoryUseCase) {}

  @Roles(Role.ADMIN)
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
