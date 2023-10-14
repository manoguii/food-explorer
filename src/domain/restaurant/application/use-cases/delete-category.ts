import { Either, left, right } from '@/core/either'
import { CategoryRepository } from '../repositories/category-repository'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'

interface DeleteCategoryUseCaseRequest {
  categoryId: string
}

type DeleteCategoryUseCaseResponse = Either<ResourceNotFoundError, null>

export class DeleteCategoryUseCase {
  constructor(private categoryRepository: CategoryRepository) {}

  async execute({
    categoryId,
  }: DeleteCategoryUseCaseRequest): Promise<DeleteCategoryUseCaseResponse> {
    const category = await this.categoryRepository.findById(categoryId)

    if (!category) {
      return left(new ResourceNotFoundError())
    }

    await this.categoryRepository.delete(category)

    return right(null)
  }
}
