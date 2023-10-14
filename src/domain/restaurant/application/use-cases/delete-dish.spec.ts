import { DeleteDishUseCase } from './delete-dish'
import { InMemoryDishRepository } from 'test/repositories/in-memory-dish-repository'
import { makeDish } from 'test/factories/make-dish'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { InMemoryDishAttachmentsRepository } from 'test/repositories/in-memory-dish-attachments-repository'
import { InMemoryDishIngredientsRepository } from 'test/repositories/in-memory-dish-ingredients-repository'
import { makeDishAttachment } from 'test/factories/make-dish-attachment'
import { makeDishIngredient } from 'test/factories/make-dish-ingredient'

let inMemoryDishRepository: InMemoryDishRepository
let inMemoryDishAttachmentsRepository: InMemoryDishAttachmentsRepository
let inMemoryDishIngredientsRepository: InMemoryDishIngredientsRepository
let sut: DeleteDishUseCase

describe('Delete Dish', () => {
  beforeEach(() => {
    inMemoryDishAttachmentsRepository = new InMemoryDishAttachmentsRepository()
    inMemoryDishIngredientsRepository = new InMemoryDishIngredientsRepository()
    inMemoryDishRepository = new InMemoryDishRepository(
      inMemoryDishAttachmentsRepository,
      inMemoryDishIngredientsRepository,
    )

    sut = new DeleteDishUseCase(inMemoryDishRepository)
  })

  it('should be able to delete a dish', async () => {
    const newDish = makeDish({}, new UniqueEntityID('dish-1'))

    await inMemoryDishRepository.create(newDish)

    // Cria inicialmente um prato com 2 arquivos e com 2 ingredientes e espera que quando o prato for deletado, os arquivos e ingredientes também sejam deletados
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
        ingredientId: new UniqueEntityID('ingredient-1'),
        dishId: newDish.id,
      }),
      makeDishIngredient({
        ingredientId: new UniqueEntityID('ingredient-2'),
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
})
