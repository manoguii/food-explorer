import { InMemoryDishRepository } from 'test/repositories/in-memory-dish-repository'
import { ChooseDishAsFavoriteUseCase } from './choose-dish-as-favorite'
import { InMemoryDishAttachmentsRepository } from 'test/repositories/in-memory-dish-attachments-repository'
import { InMemoryDishIngredientsRepository } from 'test/repositories/in-memory-dish-ingredients-repository'
import { InMemoryClientsRepository } from 'test/repositories/in-memory-clients-repository'
import { makeDish } from 'test/factories/make-dish'
import { makeClient } from 'test/factories/make-client'

let inMemoryClientsRepository: InMemoryClientsRepository
let inMemoryDishAttachmentRepository: InMemoryDishAttachmentsRepository
let inMemoryDishIngredientsRepository: InMemoryDishIngredientsRepository
let inMemoryDishRepository: InMemoryDishRepository
let sut: ChooseDishAsFavoriteUseCase

// TODO: Pending implementation
describe('Choose dish as favorite', () => {
  beforeEach(() => {
    inMemoryClientsRepository = new InMemoryClientsRepository()

    inMemoryDishAttachmentRepository = new InMemoryDishAttachmentsRepository()
    inMemoryDishIngredientsRepository = new InMemoryDishIngredientsRepository()
    inMemoryDishRepository = new InMemoryDishRepository(
      inMemoryDishAttachmentRepository,
      inMemoryDishIngredientsRepository,
    )

    sut = new ChooseDishAsFavoriteUseCase(
      inMemoryDishRepository,
      inMemoryClientsRepository,
    )
  })

  it('should be able to choose dish dish as favorite', async () => {
    const dish = makeDish()

    const client = makeClient()

    await inMemoryDishRepository.create(dish)
    await inMemoryClientsRepository.create(client)

    await sut.execute({
      clientId: client.id.toString(),
      dishId: dish.id.toString(),
    })

    expect(inMemoryDishRepository.items).toHaveLength(1)
  })
})
