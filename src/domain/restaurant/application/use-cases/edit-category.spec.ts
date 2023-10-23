import { EditCategoryUseCase } from './edit-category'
import { InMemoryCategoryRepository } from 'test/repositories/in-memory-category-repository'
import { makeCategory } from 'test/factories/make-category'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'

let inMemoryCategoryRepository: InMemoryCategoryRepository
let sut: EditCategoryUseCase

describe('Edit Category', () => {
  beforeEach(() => {
    inMemoryCategoryRepository = new InMemoryCategoryRepository()

    sut = new EditCategoryUseCase(inMemoryCategoryRepository)
  })

  it('should be able to edit a category', async () => {
    const newCategory = makeCategory()

    await inMemoryCategoryRepository.create(newCategory)

    const result = await sut.execute({
      categoryId: newCategory.id.toValue(),
      name: 'New category name',
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryCategoryRepository.items[0].name).toBe('New category name')
  })

  it('should not be able to edit a category when it does not exist', async () => {
    const result = await sut.execute({
      categoryId: 'invalid-category-id',
      name: 'New category name',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
