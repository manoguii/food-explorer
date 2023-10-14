import { Category } from '@/domain/restaurant/enterprise/entities/category'
import { Either, right } from '@/core/either'
import { CategoryRepository } from '../repositories/category-repository'
import { Injectable } from '@nestjs/common'

interface CreateCategoryUseCaseRequest {
  name: string
}

type CreateCategoryUseCaseResponse = Either<
  null,
  {
    category: Category
  }
>

@Injectable()
export class CreateCategoryUseCase {
  constructor(private categoryRepository: CategoryRepository) {}

  async execute({
    name,
  }: CreateCategoryUseCaseRequest): Promise<CreateCategoryUseCaseResponse> {
    const category = Category.create({
      name,
    })

    await this.categoryRepository.create(category)

    return right({
      category,
    })
  }
}
