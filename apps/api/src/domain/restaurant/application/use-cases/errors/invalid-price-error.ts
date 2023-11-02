import { UseCaseError } from '@/core/errors/use-case-error'

export class InvalidPriceError extends Error implements UseCaseError {
  constructor() {
    super(`Price must be a valid number.`)
  }
}
