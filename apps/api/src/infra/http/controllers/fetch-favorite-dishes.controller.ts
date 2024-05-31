import { BadRequestException, Controller, Get, Query } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { z } from 'zod'

import { FetchFavoriteDishesUseCase } from '@/domain/restaurant/application/use-cases/fetch-favorite-dishes'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'

import { DishWithDetailsPresenter } from '../presenters/dish-with-details-presenter'

const pageQueryParamSchema = z
  .string()
  .optional()
  .default('1')
  .transform(Number)
  .pipe(z.number().min(1))

const queryValidationPipe = new ZodValidationPipe(pageQueryParamSchema)

type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>

@ApiTags('Dish')
@Controller('/dish/favorites')
export class FetchFavoriteDishesController {
  constructor(private fetchFavoriteDishes: FetchFavoriteDishesUseCase) {}

  @Get()
  async handle(
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
}
