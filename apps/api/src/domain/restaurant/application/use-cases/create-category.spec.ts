import { InMemoryCategoryRepository } from 'test/repositories/in-memory-category-repository'

import { CreateCategoryUseCase } from './create-category'
import { ConflictExceptionError } from './errors/conflict-exception-error'

let inMemoryCategoryRepository: InMemoryCategoryRepository
let sut: CreateCategoryUseCase

describe('Create Category', () => {
  beforeEach(() => {
    inMemoryCategoryRepository = new InMemoryCategoryRepository()
    sut = new CreateCategoryUseCase(inMemoryCategoryRepository)
  })

  it('should be able to create a category', async () => {
    const result = await sut.execute({
      name: 'Category Name',
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryCategoryRepository.items[0]).toEqual(
      expect.objectContaining({
        name: 'Category Name',
      }),
    )
  })

  it('should not be able to create a category with the same name', async () => {
    const categoryName = 'Category Name'

    await sut.execute({
      name: categoryName,
    })

    const result = await sut.execute({
      name: categoryName,
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ConflictExceptionError)
  })
})
