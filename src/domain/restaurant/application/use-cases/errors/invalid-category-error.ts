import { UseCaseError } from '@/core/errors/use-case-error'

export class InvalidCategoryError extends Error implements UseCaseError {
  constructor(name: string) {
    super(`Category with name "${name}" does not exist !`)
  }
}
