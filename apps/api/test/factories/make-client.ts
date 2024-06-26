import { faker } from '@faker-js/faker'
import { Injectable } from '@nestjs/common'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  Client,
  ClientProps,
} from '@/domain/restaurant/enterprise/entities/client'
import { PrismaClientMapper } from '@/infra/database/prisma/mappers/prisma-client-mapper'
import { PrismaService } from '@/infra/database/prisma/prisma.service'

export function makeClient(
  override: Partial<ClientProps> = {},
  id?: UniqueEntityID,
) {
  const client = Client.create(
    {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      image: faker.image.avatarGitHub(),
      role: 'CLIENT',
      ...override,
    },
    id,
  )

  return client
}

@Injectable()
export class ClientFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaClient(data: Partial<ClientProps> = {}): Promise<Client> {
    const client = makeClient(data)

    await this.prisma.user.create({
      data: PrismaClientMapper.toPrisma(client),
    })

    return client
  }
}
