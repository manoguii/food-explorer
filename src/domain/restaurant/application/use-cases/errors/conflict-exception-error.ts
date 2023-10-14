import { UseCaseError } from '@/core/errors/use-case-error'

export class ConflictExceptionError extends Error implements UseCaseError {
  constructor(identifier: string) {
    super(`Dish "${identifier}" already is a favorite.`)
  }
}
