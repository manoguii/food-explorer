import {
  BadRequestException,
  Controller,
  Delete,
  Param,
  NotFoundException,
} from '@nestjs/common'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { ApiTags } from '@nestjs/swagger'
import { DeleteDishFromFavoritesUseCase } from '@/domain/restaurant/application/use-cases/delete-dish-from-favorites'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'

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
