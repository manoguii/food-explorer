import { InMemoryDishRepository } from 'test/repositories/in-memory-dish-repository'
import { FetchRecentDishUseCase } from './fetch-recent-dish'
import { InMemoryDishAttachmentsRepository } from 'test/repositories/in-memory-dish-attachments-repository'
import { makeDish } from 'test/factories/make-dish'
import { InMemoryDishIngredientsRepository } from 'test/repositories/in-memory-dish-ingredients-repository'

let inMemoryDishAttachmentRepository: InMemoryDishAttachmentsRepository
let inMemoryDishIngredientsRepository: InMemoryDishIngredientsRepository
let inMemoryDishRepository: InMemoryDishRepository
let sut: FetchRecentDishUseCase

describe('Fetch recent dish', () => {
  beforeEach(() => {
    inMemoryDishAttachmentRepository = new InMemoryDishAttachmentsRepository()
    inMemoryDishIngredientsRepository = new InMemoryDishIngredientsRepository()
    inMemoryDishRepository = new InMemoryDishRepository(
      inMemoryDishAttachmentRepository,
      inMemoryDishIngredientsRepository,
    )
    sut = new FetchRecentDishUseCase(inMemoryDishRepository)
  })

  it('should be able to fetch recent dish', async () => {
    await inMemoryDishRepository.create(
      makeDish({
        createdAt: new Date(2022, 0, 20),
      }),
    )
    await inMemoryDishRepository.create(
      makeDish({
        createdAt: new Date(2022, 0, 18),
      }),
    )
    await inMemoryDishRepository.create(
      makeDish({
        createdAt: new Date(2022, 0, 23),
      }),
    )

    const result = await sut.execute({
      page: 1,
    })

    expect(result.value?.dish).toEqual([
      expect.objectContaining({ createdAt: new Date(2022, 0, 23) }),
      expect.objectContaining({ createdAt: new Date(2022, 0, 20) }),
      expect.objectContaining({ createdAt: new Date(2022, 0, 18) }),
    ])
  })

  it('should be able to fetch paginated recent dish', async () => {
    for (let i = 1; i <= 22; i++) {
      await inMemoryDishRepository.create(makeDish())
    }

    const result = await sut.execute({
      page: 2,
    })

    expect(result.value?.dish).toHaveLength(2)
  })
})
