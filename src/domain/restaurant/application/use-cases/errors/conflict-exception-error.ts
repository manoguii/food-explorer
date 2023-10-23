import { UseCaseError } from '@/core/errors/use-case-error'

export class ConflictExceptionError extends Error implements UseCaseError {
  constructor(identifier: string) {
    super(`Item with identifier ${identifier} already exists`)
  }
}
