import { Ingredient } from '../../enterprise/entities/ingredient'

export abstract class IngredientsRepository {
  abstract create(ingredient: Ingredient): Promise<void>
}
