import { UseCaseError } from '@/core/errors/use-case-error'

export class CartNotFoundError extends Error implements UseCaseError {
  constructor() {
    super('Cart not found.')
  }
}
