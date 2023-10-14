import { BadRequestException, Controller, Get, Query } from '@nestjs/common'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { z } from 'zod'
import { FetchRecentDishUseCase } from '@/domain/restaurant/application/use-cases/fetch-recent-dish'
import { DishPresenter } from '../presenters/dish-presenter'

const pageQueryParamSchema = z
  .string()
  .optional()
  .default('1')
  .transform(Number)
  .pipe(z.number().min(1))

const queryValidationPipe = new ZodValidationPipe(pageQueryParamSchema)

type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>

@Controller('/dishes')
export class FetchRecentDishController {
  constructor(private fetchRecentDish: FetchRecentDishUseCase) {}

  @Get()
  async handle(@Query('page', queryValidationPipe) page: PageQueryParamSchema) {
    const result = await this.fetchRecentDish.execute({
      page,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }

    const dishes = result.value.dish

    return { dishes: dishes.map(DishPresenter.toHTTP) }
  }
}
