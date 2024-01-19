import { DeleteDishUseCase } from './delete-dish'
import { InMemoryDishRepository } from 'test/repositories/in-memory-dish-repository'
import { makeDish } from 'test/factories/make-dish'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { InMemoryDishAttachmentsRepository } from 'test/repositories/in-memory-dish-attachments-repository'
import { InMemoryDishIngredientsRepository } from 'test/repositories/in-memory-dish-ingredients-repository'
import { makeDishAttachment } from 'test/factories/make-dish-attachment'
import { makeDishIngredient } from 'test/factories/make-dish-ingredient'
import { InMemoryCategoryRepository } from 'test/repositories/in-memory-category-repository'
import { InMemoryAttachmentsRepository } from 'test/repositories/in-memory-attachments-repository'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'

let inMemoryDishRepository: InMemoryDishRepository
let inMemoryDishAttachmentsRepository: InMemoryDishAttachmentsRepository
let inMemoryDishIngredientsRepository: InMemoryDishIngredientsRepository
let inMemoryCategoryRepository: InMemoryCategoryRepository
let inMemoryAttachmentsRepository: InMemoryAttachmentsRepository
let sut: DeleteDishUseCase

describe('Delete Dish', () => {
  beforeEach(() => {
    inMemoryDishAttachmentsRepository = new InMemoryDishAttachmentsRepository()
    inMemoryDishIngredientsRepository = new InMemoryDishIngredientsRepository()
    inMemoryCategoryRepository = new InMemoryCategoryRepository()
    inMemoryAttachmentsRepository = new InMemoryAttachmentsRepository()
    inMemoryDishRepository = new InMemoryDishRepository(
      inMemoryDishAttachmentsRepository,
      inMemoryDishIngredientsRepository,
      inMemoryCategoryRepository,
      inMemoryAttachmentsRepository,
    )

    sut = new DeleteDishUseCase(inMemoryDishRepository)
  })

  it('should be able to delete a dish', async () => {
    const newDish = makeDish({}, new UniqueEntityID('dish-1'))

    await inMemoryDishRepository.create(newDish)

    inMemoryDishAttachmentsRepository.items.push(
      makeDishAttachment({
        attachmentId: new UniqueEntityID('attachment-1'),
        dishId: newDish.id,
      }),
      makeDishAttachment({
        attachmentId: new UniqueEntityID('attachment-2'),
        dishId: newDish.id,
      }),
    )

    inMemoryDishIngredientsRepository.items.push(
      makeDishIngredient({
        ingredientName: 'Batata',
        dishId: newDish.id,
      }),
      makeDishIngredient({
        ingredientName: 'Banana',
        dishId: newDish.id,
      }),
    )

    await sut.execute({
      dishId: 'dish-1',
    })

    expect(inMemoryDishRepository.items).toHaveLength(0)
    expect(inMemoryDishAttachmentsRepository.items).toHaveLength(0)
    expect(inMemoryDishIngredientsRepository.items).toHaveLength(0)
  })

  it('should not be able to delete a dish when it does not exist', async () => {
    const result = await sut.execute({
      dishId: 'invalid-dish-id',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
