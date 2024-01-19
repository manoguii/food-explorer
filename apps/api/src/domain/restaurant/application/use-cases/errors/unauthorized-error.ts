import { UseCaseError } from '@/core/errors/use-case-error'

export class UnauthorizedError extends Error implements UseCaseError {
  constructor(identifier: string) {
    super(
      `Client with id "${identifier}" is not authorized to perform this action.`,
    )
  }
}
