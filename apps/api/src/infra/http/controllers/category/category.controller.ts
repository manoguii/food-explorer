import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { z } from 'zod'

import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { CreateCategoryUseCase } from '@/domain/restaurant/application/use-cases/create-category'
import { DeleteCategoryUseCase } from '@/domain/restaurant/application/use-cases/delete-category'
import { EditCategoryUseCase } from '@/domain/restaurant/application/use-cases/edit-category'
import { ConflictExceptionError } from '@/domain/restaurant/application/use-cases/errors/conflict-exception-error'
import { FetchCategoriesUseCase } from '@/domain/restaurant/application/use-cases/fetch-categories'
import { Roles } from '@/infra/auth/roles-decorator'
import { Role } from '@/infra/auth/roles-enum'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'

import { CategoryPresenter } from '../../presenters/category-presenter'

const createCategoryBodySchema = z.object({
  name: z.string(),
})

const editCategoryBodySchema = z.object({
  name: z.string(),
})

const pageQueryParamSchema = z
  .string()
  .optional()
  .default('1')
  .transform(Number)
  .pipe(z.number().min(1))

const editCategoryBodyValidationPipe = new ZodValidationPipe(
  editCategoryBodySchema,
)

const queryValidationPipe = new ZodValidationPipe(pageQueryParamSchema)
const createCategoryBodyValidationPipe = new ZodValidationPipe(
  createCategoryBodySchema,
)

type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>
type CreateCategoryBodySchema = z.infer<typeof createCategoryBodySchema>
type EditCategoryBodySchema = z.infer<typeof editCategoryBodySchema>

@ApiTags('Categories')
@Controller('/categories')
export class CategoryController {
  constructor(
    private createCategory: CreateCategoryUseCase,
    private deleteCategory: DeleteCategoryUseCase,
    private editCategory: EditCategoryUseCase,
    private fetchCategories: FetchCategoriesUseCase,
  ) {}

  @Get()
  async fetch(@Query('page', queryValidationPipe) page: PageQueryParamSchema) {
    const result = await this.fetchCategories.execute({
      page,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }

    const categories = result.value.categories
    const totalPages = result.value.totalPages

    return {
      categories: categories.map(CategoryPresenter.toHTTP),
      totalPages,
    }
  }

  @Roles(Role.ADMIN)
  @Post()
  async create(
    @Body(createCategoryBodyValidationPipe) body: CreateCategoryBodySchema,
  ) {
    const { name } = body

    const result = await this.createCategory.execute({
      name,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case ConflictExceptionError:
          throw new BadRequestException(error.message)
        default:
      }
    }

    const category = result.isRight() ? result.value.category : null

    if (!category) {
      throw new BadRequestException('Something went wrong')
    }

    return {
      category: CategoryPresenter.toHTTP(category),
    }
  }

  @Roles(Role.ADMIN)
  @Patch(':categoryId')
  async edit(
    @Body(editCategoryBodyValidationPipe) body: EditCategoryBodySchema,
    @Param('categoryId') categoryId: string,
  ) {
    const { name } = body

    const result = await this.editCategory.execute({
      name,
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
  @Delete(':categoryId')
  async delete(@Param('categoryId') categoryId: string) {
    const result = await this.deleteCategory.execute({
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
}
