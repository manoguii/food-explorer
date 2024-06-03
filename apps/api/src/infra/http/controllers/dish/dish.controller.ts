import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { z } from 'zod'

import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { CreateDishUseCase } from '@/domain/restaurant/application/use-cases/create-dish'
import { DeleteDishUseCase } from '@/domain/restaurant/application/use-cases/delete-dish'
import { EditDishUseCase } from '@/domain/restaurant/application/use-cases/edit-dish'
import { InvalidCategoryError } from '@/domain/restaurant/application/use-cases/errors/invalid-category-error'
import { FetchDishesByCategoryUseCase } from '@/domain/restaurant/application/use-cases/fetch-dishes-by-category'
import { FetchFilteredDishesUseCase } from '@/domain/restaurant/application/use-cases/fetch-filtered-dishes'
import { GetDishBySlugUseCase } from '@/domain/restaurant/application/use-cases/get-dish-by-slug'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { Roles } from '@/infra/auth/roles-decorator'
import { Role } from '@/infra/auth/roles-enum'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'

import { DishWithDetailsPresenter } from '../../presenters/dish-with-details-presenter'

const createDishBodySchema = z.object({
  name: z.string(),
  price: z.number(),
  description: z.string(),
  categoryId: z.string(),
  ingredients: z.array(z.string()),
  attachmentsIds: z.array(z.string().uuid()),
})

const editDishBodySchema = z.object({
  name: z.string(),
  price: z.number(),
  description: z.string(),
  ingredients: z.array(z.string()),
  categoryId: z.string().uuid(),
  attachmentsIds: z.array(z.string().uuid()),
})

const queryParamSchema = z.object({
  page: z
    .string()
    .optional()
    .default('1')
    .transform(Number)
    .pipe(z.number().min(1)),
})

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
const queryValidationPipe = new ZodValidationPipe(queryParamSchema)
const editDishBodyValidationPipe = new ZodValidationPipe(editDishBodySchema)
const createDishBodyValidationPipe = new ZodValidationPipe(createDishBodySchema)

type CreateDishBodySchema = z.infer<typeof createDishBodySchema>
type EditDishBodySchema = z.infer<typeof editDishBodySchema>
type QueryParamSchema = z.infer<typeof queryParamSchema>
type SearchParamsSchema = z.infer<typeof searchParamsSchema>

@ApiTags('Dish')
@Controller('/dishes')
export class DishController {
  constructor(
    private createDish: CreateDishUseCase,
    private editDish: EditDishUseCase,
    private deleteDish: DeleteDishUseCase,
    private getDishBySlug: GetDishBySlugUseCase,
    private fetchDishesByCategories: FetchDishesByCategoryUseCase,
    private fetchFilteredDishes: FetchFilteredDishesUseCase,
  ) {}

  @Get('/category/:category')
  async fetchByCategory(
    @CurrentUser() user: UserPayload,
    @Param('category') category: string,
    @Query(queryValidationPipe) query: QueryParamSchema,
  ) {
    const { page } = query

    const result = await this.fetchDishesByCategories.execute({
      category,
      clientId: user.sub,
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
    const totalPages = result.value.totalPages

    return {
      dishes: dishes.map(DishWithDetailsPresenter.toHTTP),
      totalPages,
    }
  }

  @Get(':slug')
  async getBySlug(@Param('slug') slug: string) {
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

  @Get()
  async fetchFiltered(
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

  @Roles(Role.ADMIN)
  @Post()
  async create(@Body(createDishBodyValidationPipe) body: CreateDishBodySchema) {
    const {
      description,
      name,
      price,
      categoryId,
      ingredients,
      attachmentsIds,
    } = body

    const result = await this.createDish.execute({
      name,
      price,
      description,
      categoryId,
      ingredients,
      attachmentsIds,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }

  @Roles(Role.ADMIN)
  @Put(':id')
  async edit(
    @Body(editDishBodyValidationPipe) body: EditDishBodySchema,
    @Param('id') dishId: string,
  ) {
    const {
      description,
      name,
      price,
      ingredients,
      attachmentsIds,
      categoryId,
    } = body

    const result = await this.editDish.execute({
      name,
      price,
      description,
      ingredients,
      attachmentsIds,
      dishId,
      categoryId,
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

  @Roles(Role.ADMIN)
  @Delete(':dishId')
  async delete(@Param('dishId') dishId: string) {
    const result = await this.deleteDish.execute({
      dishId,
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
