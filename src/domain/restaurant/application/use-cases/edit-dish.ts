import { Either, left, right } from '@/core/either'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { Dish } from '@/domain/restaurant/enterprise/entities/dish'
import { DishRepository } from '../repositories/dish-repository'
import { DishAttachmentsRepository } from '../repositories/dish-attachments-repository'
import { DishIngredientsRepository } from '../repositories/dish-ingredients-repository'
import { DishAttachmentList } from '../../enterprise/entities/dish-attachment-list'
import { DishIngredientList } from '../../enterprise/entities/dish-ingredient-list'
import { DishAttachment } from '../../enterprise/entities/dish-attachment'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { DishIngredient } from '../../enterprise/entities/dish-ingredient'

interface EditDishUseCaseRequest {
  dishId: string
  name: string
  description: string
  price: string
  ingredientIds: string[]
  attachmentsIds: string[]
}

type EditDishUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    dish: Dish
  }
>

export class EditDishUseCase {
  constructor(
    private dishRepository: DishRepository,
    private dishAttachmentsRepository: DishAttachmentsRepository,
    private dishIngredientsRepository: DishIngredientsRepository,
  ) {}

  async execute({
    dishId,
    description,
    name,
    price,
    attachmentsIds,
    ingredientIds,
  }: EditDishUseCaseRequest): Promise<EditDishUseCaseResponse> {
    const dish = await this.dishRepository.findById(dishId)

    if (!dish) {
      return left(new ResourceNotFoundError())
    }

    // Busca todos arquivos e ingredientes do prato
    const currentDishAttachments =
      await this.dishAttachmentsRepository.findManyByDishId(dishId)
    const currentDishIngredients =
      await this.dishIngredientsRepository.findManyByDishId(dishId)

    // Cria uma Watched List com os arquivos e ingredientes do prato
    const dishAttachmentsList = new DishAttachmentList(currentDishAttachments)
    const dishIngredientsList = new DishIngredientList(currentDishIngredients)

    // Cria o relacionamento entre o prato e os arquivos e ingredientes
    const dishAttachments = attachmentsIds.map((attachmentId) => {
      return DishAttachment.create({
        attachmentId: new UniqueEntityID(attachmentId),
        dishId: dish.id,
      })
    })
    const dishIngredient = ingredientIds.map((ingredientId) => {
      return DishIngredient.create({
        ingredientId: new UniqueEntityID(ingredientId),
        dishId: dish.id,
      })
    })

    // Compara os arquivos e ingredientes atuais com os novos com base na Watched List
    dishAttachmentsList.update(dishAttachments)
    dishIngredientsList.update(dishIngredient)

    dish.name = name
    dish.price = price
    dish.description = description

    // Atualiza os arquivos e ingredientes do prato
    dish.attachments = dishAttachmentsList
    dish.ingredients = dishIngredientsList

    await this.dishRepository.save(dish)

    return right({
      dish,
    })
  }
}
