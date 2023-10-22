import { BadRequestException, Controller, Get, Param } from '@nestjs/common'
import { GetDishBySlugUseCase } from '@/domain/restaurant/application/use-cases/get-dish-by-slug'
import { DishWithDetailsPresenter } from '../presenters/dish-with-details-presenter'

@Controller('/dishes/:slug')
export class GetDishBySlugController {
  constructor(private getDishBySlug: GetDishBySlugUseCase) {}

  @Get()
  async handle(@Param('slug') slug: string) {
    const result = await this.getDishBySlug.execute({
      slug,
    })
    if (result.isLeft()) {
      throw new BadRequestException()
    }

    const dish = result.value.dish

    return { dish: DishWithDetailsPresenter.toHTTP(dish) }
  }
}
