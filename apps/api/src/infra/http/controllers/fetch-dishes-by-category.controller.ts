import {
  BadRequestException,
  Controller,
  Get,
  Query,
  NotFoundException,
  Param,
} from '@nestjs/common'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { z } from 'zod'
import { InvalidCategoryError } from '@/domain/restaurant/application/use-cases/errors/invalid-category-error'
import { ApiTags } from '@nestjs/swagger'
import { FetchDishesByCategoryUseCase } from '@/domain/restaurant/application/use-cases/fetch-dishes-by-category'
import { DishWithDetailsPresenter } from '../presenters/dish-with-details-presenter'

const queryParamSchema = z.object({
  page: z
    .string()
    .optional()
    .default('1')
    .transform(Number)
    .pipe(z.number().min(1)),
})

const queryValidationPipe = new ZodValidationPipe(queryParamSchema)

type QueryParamSchema = z.infer<typeof queryParamSchema>

@ApiTags('Dish')
@Controller('/dish/:category')
export class FetchDishesByCategoryController {
  constructor(private fetchDishesByCategories: FetchDishesByCategoryUseCase) {}

  @Get()
  async handle(
    @Param('category') category: string,
    @Query(queryValidationPipe) query: QueryParamSchema,
  ) {
    const { page } = query

    const result = await this.fetchDishesByCategories.execute({
      category,
      page,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case InvalidCategoryError:
          throw new NotFoundException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }

    const dishes = result.value.dishes

    return { dishes: dishes.map(DishWithDetailsPresenter.toHTTP) }
  }
}
