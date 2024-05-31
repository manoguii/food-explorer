import { Injectable } from '@nestjs/common'

import { Either, left, right } from '@/core/either'
import { Category } from '@/domain/restaurant/enterprise/entities/category'

import { CategoryRepository } from '../repositories/category-repository'
import { ConflictExceptionError } from './errors/conflict-exception-error'

interface CreateCategoryUseCaseRequest {
  name: string
}

type CreateCategoryUseCaseResponse = Either<
  ConflictExceptionError,
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
    const categoryExists = await this.categoryRepository.findByName(name)

    if (categoryExists) {
      return left(new ConflictExceptionError(categoryExists.id.toString()))
    }

    const category = Category.create({
      name,
    })

    await this.categoryRepository.create(category)

    return right({
      category,
    })
  }
}
