import { InMemoryCategoryRepository } from 'test/repositories/in-memory-category-repository'
import { CreateCategoryUseCase } from './create-category'

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
    expect(inMemoryCategoryRepository.items[0]).toEqual(result.value?.category)
  })
})
