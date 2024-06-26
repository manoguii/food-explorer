import { Injectable } from '@nestjs/common'

import { Either, right } from '@/core/either'

import { Category } from '../../enterprise/entities/category'
import { CategoryRepository } from '../repositories/category-repository'

interface FetchCategoriesUseCaseRequest {
  page: number
}

type FetchCategoriesUseCaseResponse = Either<
  null,
  {
    categories: Category[]
    totalPages: number
  }
>

@Injectable()
export class FetchCategoriesUseCase {
  constructor(private categoryRepository: CategoryRepository) {}

  async execute({
    page,
  }: FetchCategoriesUseCaseRequest): Promise<FetchCategoriesUseCaseResponse> {
    const { categories, totalPages } = await this.categoryRepository.findMany({
      page,
    })

    return right({
      categories,
      totalPages,
    })
  }
}
