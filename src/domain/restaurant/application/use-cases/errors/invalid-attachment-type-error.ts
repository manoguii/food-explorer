import { UseCaseError } from '@/core/errors/use-case-error'

export class InvalidAttachmentTypeError extends Error implements UseCaseError {
  constructor(identifier: string) {
    super(`File type "${identifier}" is not valid.`)
  }
}
