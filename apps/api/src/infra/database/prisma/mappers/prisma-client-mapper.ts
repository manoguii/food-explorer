import { Prisma, User as PrismaUser } from '@prisma/client'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Client } from '@/domain/restaurant/enterprise/entities/client'

export class PrismaClientMapper {
  static toDomain(raw: PrismaUser): Client {
    return Client.create(
      {
        name: raw.name,
        email: raw.email,
        password: raw.password,
        image: raw.image,
        role: raw.role,
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPrisma(client: Client): Prisma.UserUncheckedCreateInput {
    return {
      id: client.id.toString(),
      name: client.name,
      email: client.email,
      password: client.password,
      image: client.image,
      role: client.role || 'CLIENT',
    }
  }
}
