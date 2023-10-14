import { DeleteCategoryUseCase } from './delete-category'
import { InMemoryCategoryRepository } from 'test/repositories/in-memory-category-repository'
import { makeCategory } from 'test/factories/make-category'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

let inMemoryCategoryRepository: InMemoryCategoryRepository
let sut: DeleteCategoryUseCase

describe('Delete Category', () => {
  beforeEach(() => {
    inMemoryCategoryRepository = new InMemoryCategoryRepository()

    sut = new DeleteCategoryUseCase(inMemoryCategoryRepository)
  })

  it('should be able to delete a category', async () => {
    const newCategory = makeCategory({}, new UniqueEntityID('category-1'))

    await inMemoryCategoryRepository.create(newCategory)

    await sut.execute({
      categoryId: 'category-1',
    })

    expect(inMemoryCategoryRepository.items).toHaveLength(0)
  })
})
