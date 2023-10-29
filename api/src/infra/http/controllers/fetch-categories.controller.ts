import { BadRequestException, Controller, Get, Query } from '@nestjs/common'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { z } from 'zod'
import { FetchCategoriesUseCase } from '@/domain/restaurant/application/use-cases/fetch-categories'
import { CategoryPresenter } from '../presenters/category-presenter'
import { ApiTags } from '@nestjs/swagger'

const pageQueryParamSchema = z
  .string()
  .optional()
  .default('1')
  .transform(Number)
  .pipe(z.number().min(1))

const queryValidationPipe = new ZodValidationPipe(pageQueryParamSchema)

type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>

@ApiTags('Category')
@Controller('/categories')
export class FetchCategoriesController {
  constructor(private fetchCategories: FetchCategoriesUseCase) {}

  @Get()
  async handle(@Query('page', queryValidationPipe) page: PageQueryParamSchema) {
    const result = await this.fetchCategories.execute({
      page,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }

    const categories = result.value.categories

    return { categories: categories.map(CategoryPresenter.toHTTP) }
  }
}
