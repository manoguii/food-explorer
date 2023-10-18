import { EditDishUseCase } from './edit-dish'
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
let sut: EditDishUseCase

describe('Edit Dish', () => {
  beforeEach(() => {
    inMemoryDishAttachmentsRepository = new InMemoryDishAttachmentsRepository()
    inMemoryDishIngredientsRepository = new InMemoryDishIngredientsRepository()
    inMemoryDishRepository = new InMemoryDishRepository(
      inMemoryDishAttachmentsRepository,
      inMemoryDishIngredientsRepository,
    )

    sut = new EditDishUseCase(
      inMemoryDishRepository,
      inMemoryDishAttachmentsRepository,
      inMemoryDishIngredientsRepository,
    )
  })

  it('should be able to edit a dish', async () => {
    const newDish = makeDish({}, new UniqueEntityID('dish-1'))

    await inMemoryDishRepository.create(newDish)

    // Cria inicialmente um prato com 2 arquivos e com 2 ingredientes

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

    // Edita o prato com 1 arquivo novo e um antigo, o mesmo para os ingredientes

    const result = await sut.execute({
      dishId: newDish.id.toValue(),
      description: 'Dish description',
      name: 'Dish name',
      price: 1000,
      attachmentsIds: ['attachment-1', 'new-attachment'],
      ingredientIds: ['ingredient-1', 'new-ingredient'],
    })

    // Espera-se que nos currentItems tenha 1 arquivo novo e um antigo, o mesmo para os ingredientes
    expect(result.isRight()).toBe(true)
    expect(
      inMemoryDishRepository.items[0].attachments.currentItems,
    ).toHaveLength(2)
    expect(inMemoryDishRepository.items[0].attachments.currentItems).toEqual([
      expect.objectContaining({
        attachmentId: new UniqueEntityID('attachment-1'),
      }),
      expect.objectContaining({
        attachmentId: new UniqueEntityID('new-attachment'),
      }),
    ])
    expect(
      inMemoryDishRepository.items[0].ingredients.currentItems,
    ).toHaveLength(2)
    expect(inMemoryDishRepository.items[0].ingredients.currentItems).toEqual([
      expect.objectContaining({
        ingredientId: new UniqueEntityID('ingredient-1'),
      }),
      expect.objectContaining({
        ingredientId: new UniqueEntityID('new-ingredient'),
      }),
    ])
  })
})
