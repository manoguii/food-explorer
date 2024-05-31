import { BadRequestException, Controller, Get, Query } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { z } from 'zod'

import { FetchFilteredDishesUseCase } from '@/domain/restaurant/application/use-cases/fetch-filtered-dishes'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'

import { DishWithDetailsPresenter } from '../presenters/dish-with-details-presenter'

const searchParamsSchema = z.object({
  page: z
    .string()
    .optional()
    .default('1')
    .transform(Number)
    .pipe(z.number().min(1)),
  query: z.string().optional().default(''),
})

const searchParamsValidationPipe = new ZodValidationPipe(searchParamsSchema)

type SearchParamsSchema = z.infer<typeof searchParamsSchema>

@ApiTags('Dish')
@Controller('/dishes')
export class FetchFilteredDishesController {
  constructor(private fetchFilteredDishes: FetchFilteredDishesUseCase) {}

  @Get()
  async handle(
    @CurrentUser() user: UserPayload,
    @Query(searchParamsValidationPipe)
    searchParams: SearchParamsSchema,
  ) {
    const { page, query } = searchParams

    const result = await this.fetchFilteredDishes.execute({
      page,
      query,
      clientId: user.sub,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }

    const dishes = result.value.dishes
    const totalPages = result.value.totalPages

    return {
      dishes: dishes.map(DishWithDetailsPresenter.toHTTP),
      totalPages,
    }
  }
}
