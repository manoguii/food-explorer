import {
  BadRequestException,
  Controller,
  Get,
  Query,
  NotFoundException,
} from '@nestjs/common'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { z } from 'zod'
import { DishPresenter } from '../presenters/dish-presenter'
import { FetchDishesByCategoriesUseCase } from '@/domain/restaurant/application/use-cases/fetch-dishes-by-categories'
import { InvalidCategoryError } from '@/domain/restaurant/application/use-cases/errors/invalid-category-error'

const pageQueryParamSchema = z
  .string()
  .optional()
  .default('1')
  .transform(Number)
  .pipe(z.number().min(1))

const categoriesQueryParamSchema = z
  .array(z.string())
  .min(1)
  .max(10)
  .transform((value) => value.map((category) => category.trim()))

const queryCategoriesValidationPipe = new ZodValidationPipe(
  categoriesQueryParamSchema,
)
const queryPageValidationPipe = new ZodValidationPipe(pageQueryParamSchema)

type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>
type CategoriesQueryParamSchema = z.infer<typeof categoriesQueryParamSchema>

@Controller('/dish/categories')
export class FetchDishesByCategoriesController {
  constructor(
    private fetchDishesByCategories: FetchDishesByCategoriesUseCase,
  ) {}

  @Get()
  async handle(
    @Query('categories', queryCategoriesValidationPipe)
    categories: CategoriesQueryParamSchema,
    @Query('page', queryPageValidationPipe) page: PageQueryParamSchema,
  ) {
    const result = await this.fetchDishesByCategories.execute({
      categories,
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

    return {
      dishes: dishes.map((item) => {
        return {
          category: item.category,
          items: item.items.map(DishPresenter.toHTTP),
        }
      }),
    }
  }
}
