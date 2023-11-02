import { Either, right } from '@/core/either'
import { Category } from '../../enterprise/entities/category'
import { CategoryRepository } from '../repositories/category-repository'
import { Injectable } from '@nestjs/common'

interface FetchCategoriesUseCaseRequest {
  page: number
}

type FetchCategoriesUseCaseResponse = Either<
  null,
  {
    categories: Category[]
  }
>

@Injectable()
export class FetchCategoriesUseCase {
  constructor(private categoryRepository: CategoryRepository) {}

  async execute({
    page,
  }: FetchCategoriesUseCaseRequest): Promise<FetchCategoriesUseCaseResponse> {
    const categories = await this.categoryRepository.findMany({ page })

    return right({
      categories,
    })
  }
}
