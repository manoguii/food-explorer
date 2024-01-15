import { UseCaseError } from '@/core/errors/use-case-error'

export class FailedToCreateACheckoutSessionError
  extends Error
  implements UseCaseError
{
  constructor(identifier: string) {
    super(`Failed to create a checkout session for cart ${identifier}`)
  }
}
