import { faker } from '@faker-js/faker'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  Client,
  ClientProps,
} from '@/domain/restaurant/enterprise/entities/client'

export function makeClient(
  override: Partial<ClientProps> = {},
  id?: UniqueEntityID,
) {
  const client = Client.create(
    {
      name: faker.name.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      ...override,
    },
    id,
  )

  return client
}
