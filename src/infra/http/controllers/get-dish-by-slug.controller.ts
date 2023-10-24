import {
  BadRequestException,
  Controller,
  Get,
  NotFoundException,
  Param,
} from '@nestjs/common'
import { GetDishBySlugUseCase } from '@/domain/restaurant/application/use-cases/get-dish-by-slug'
import { DishWithDetailsPresenter } from '../presenters/dish-with-details-presenter'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'

@Controller('/dishes/:slug')
export class GetDishBySlugController {
  constructor(private getDishBySlug: GetDishBySlugUseCase) {}

  @Get()
  async handle(@Param('slug') slug: string) {
    const result = await this.getDishBySlug.execute({
      slug,
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

    const dish = result.value.dish

    return { dish: DishWithDetailsPresenter.toHTTP(dish) }
  }
}
