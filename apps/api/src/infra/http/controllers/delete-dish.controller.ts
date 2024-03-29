import {
  BadRequestException,
  Controller,
  Delete,
  NotFoundException,
  Param,
} from '@nestjs/common'
import { DeleteDishUseCase } from '@/domain/restaurant/application/use-cases/delete-dish'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { ApiTags } from '@nestjs/swagger'
import { Role } from '@/infra/auth/roles-enum'
import { Roles } from '@/infra/auth/roles-decorator'

@ApiTags('Dish')
@Controller('/dishes/:dishId')
export class DeleteDishController {
  constructor(private deleteDish: DeleteDishUseCase) {}

  @Roles(Role.ADMIN)
  @Delete()
  async handle(@Param('dishId') dishId: string) {
    const result = await this.deleteDish.execute({
      dishId,
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
