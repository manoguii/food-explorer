import { UseCaseError } from '@/core/errors/use-case-error'

export class CartIdNotProvidedError extends Error implements UseCaseError {
  constructor() {
    super('Cart id not provided.')
  }
}
