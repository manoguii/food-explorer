import { UseCaseError } from '@/core/errors/use-case-error'

export class InvalidOrderError extends Error implements UseCaseError {
  constructor() {
    super(`Order is invalid !`)
  }
}
