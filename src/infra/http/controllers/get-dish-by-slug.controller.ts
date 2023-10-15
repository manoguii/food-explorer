import { BadRequestException, Controller, Get, Param } from '@nestjs/common'
import { DishPresenter } from '../presenters/dish-presenter'
import { GetDishBySlugUseCase } from '@/domain/restaurant/application/use-cases/get-dish-by-slug'

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

    const dishes = result.value.dish

    return { dishes: DishPresenter.toHTTP(dishes) }
  }
}
