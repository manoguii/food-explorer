import {
  BadRequestException,
  Controller,
  Delete,
  NotFoundException,
  Param,
} from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'

import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { DeleteDishFromFavoritesUseCase } from '@/domain/restaurant/application/use-cases/delete-dish-from-favorites'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'

@ApiTags('Dish')
@Controller('/dishes/:dishId/favorite')
export class DeleteDishFromFavoritesController {
  constructor(
    private deleteDishFromFavorites: DeleteDishFromFavoritesUseCase,
  ) {}

  @Delete()
  async handle(
    @CurrentUser() user: UserPayload,
    @Param('dishId') dishId: string,
  ) {
    const result = await this.deleteDishFromFavorites.execute({
      dishId,
      clientId: user.sub,
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
