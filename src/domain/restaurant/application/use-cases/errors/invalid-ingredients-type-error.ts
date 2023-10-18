import { UseCaseError } from '@/core/errors/use-case-error'

export class InvalidIngredientsTypeError extends Error implements UseCaseError {
  constructor() {
    super(`Dish must have at least one ingredient.`)
  }
}
