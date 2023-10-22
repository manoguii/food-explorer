import { Either, left, right } from '@/core/either'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { Category } from '@/domain/restaurant/enterprise/entities/category'
import { CategoryRepository } from '../repositories/category-repository'
import { Injectable } from '@nestjs/common'

interface EditCategoryUseCaseRequest {
  categoryId: string
  name: string
}

type EditCategoryUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    category: Category
  }
>

@Injectable()
export class EditCategoryUseCase {
  constructor(private categoryRepository: CategoryRepository) {}

  async execute({
    categoryId,
    name,
  }: EditCategoryUseCaseRequest): Promise<EditCategoryUseCaseResponse> {
    const category = await this.categoryRepository.findById(categoryId)

    if (!category) {
      return left(new ResourceNotFoundError())
    }

    category.name = name

    await this.categoryRepository.save(category)

    return right({
      category,
    })
  }
}
