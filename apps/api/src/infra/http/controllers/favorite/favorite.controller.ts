import {
  BadRequestException,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Query,
} from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { z } from 'zod'

import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { ChooseDishAsFavoriteUseCase } from '@/domain/restaurant/application/use-cases/choose-dish-as-favorite'
import { DeleteDishFromFavoritesUseCase } from '@/domain/restaurant/application/use-cases/delete-dish-from-favorites'
import { ConflictExceptionError } from '@/domain/restaurant/application/use-cases/errors/conflict-exception-error'
import { FetchFavoriteDishesUseCase } from '@/domain/restaurant/application/use-cases/fetch-favorite-dishes'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'

import { DishWithDetailsPresenter } from '../../presenters/dish-with-details-presenter'

const pageQueryParamSchema = z
  .string()
  .optional()
  .default('1')
  .transform(Number)
  .pipe(z.number().min(1))

const queryValidationPipe = new ZodValidationPipe(pageQueryParamSchema)

type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>

@ApiTags('Dish')
@Controller('/favorites')
export class FavoriteController {
  constructor(
    private chooseDishAsFavorite: ChooseDishAsFavoriteUseCase,
    private deleteDishFromFavorites: DeleteDishFromFavoritesUseCase,
    private fetchFavoriteDishes: FetchFavoriteDishesUseCase,
  ) {}

  @Get()
  async fetchFavorites(
    @Query('page', queryValidationPipe) page: PageQueryParamSchema,
    @CurrentUser() user: UserPayload,
  ) {
    const result = await this.fetchFavoriteDishes.execute({
      clientId: user.sub,
      page,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }

    const favoriteDishes = result.value.favoriteDishes
    const totalPages = result.value.totalPages

    return {
      favoriteDishes: favoriteDishes.map(DishWithDetailsPresenter.toHTTP),
      totalPages,
    }
  }

  @Patch(':dishId')
  async chooseAsFavorite(
    @Query('page', queryValidationPipe) page: PageQueryParamSchema,
    @CurrentUser() user: UserPayload,
    @Param('dishId') dishId: string,
  ) {
    const result = await this.chooseDishAsFavorite.execute({
      page,
      dishId,
      clientId: user.sub,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case ConflictExceptionError:
          throw new BadRequestException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }
  }

  @Delete(':dishId')
  async deleteFromFavorites(
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
