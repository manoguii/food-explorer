import { Injectable } from '@nestjs/common'

import { Either, left, right } from '@/core/either'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Dish } from '@/domain/restaurant/enterprise/entities/dish'

import { DishAttachment } from '../../enterprise/entities/dish-attachment'
import { DishAttachmentList } from '../../enterprise/entities/dish-attachment-list'
import { DishIngredient } from '../../enterprise/entities/dish-ingredient'
import { DishIngredientList } from '../../enterprise/entities/dish-ingredient-list'
import { Ingredient } from '../../enterprise/entities/ingredient'
import { Price } from '../../enterprise/entities/value-objects/price'
import { DishRepository } from '../repositories/dish-repository'
import { InvalidIngredientsTypeError } from './errors/invalid-ingredients-type-error'
import { InvalidPriceError } from './errors/invalid-price-error'

interface CreateDishUseCaseRequest {
  name: string
  price: number
  description: string
  categoryId: string
  ingredients: string[]
  attachmentsIds: string[]
}

type CreateDishUseCaseResponse = Either<
  InvalidIngredientsTypeError | InvalidPriceError,
  {
    dish: Dish
  }
>

@Injectable()
export class CreateDishUseCase {
  constructor(private dishRepository: DishRepository) {}

  async execute({
    name,
    price,
    description,
    categoryId,
    ingredients,
    attachmentsIds,
  }: CreateDishUseCaseRequest): Promise<CreateDishUseCaseResponse> {
    if (ingredients.length < 1) {
      return left(new InvalidIngredientsTypeError())
    }

    if (price < 0) {
      return left(new InvalidPriceError())
    }

    const dish = Dish.create({
      categoryId: new UniqueEntityID(categoryId),
      price: Price.create(price),
      description,
      name,
    })

    const ingredientsEntity = ingredients.map((ingredient) => {
      return Ingredient.create({
        name: ingredient,
      })
    })

    const dishAttachments = attachmentsIds.map((attachmentId) => {
      return DishAttachment.create({
        attachmentId: new UniqueEntityID(attachmentId),
        dishId: dish.id,
      })
    })

    const dishIngredient = ingredientsEntity.map((ingredient) => {
      return DishIngredient.create({
        ingredientName: ingredient.name,
        dishId: dish.id,
      })
    })

    dish.attachments = new DishAttachmentList(dishAttachments)
    dish.ingredients = new DishIngredientList(dishIngredient)

    await this.dishRepository.create(dish)

    return right({
      dish,
    })
  }
}
