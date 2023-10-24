import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { ClientsRepository } from '@/domain/restaurant/application/repositories/clients-repository'
import { Client } from '@/domain/restaurant/enterprise/entities/client'
import { PrismaClientMapper } from '../mappers/prisma-client-mapper'

@Injectable()
export class PrismaClientsRepository implements ClientsRepository {
  constructor(private prisma: PrismaService) {}

  async findById(id: string): Promise<Client | null> {
    const client = await this.prisma.user.findUnique({
      where: {
        id,
      },
    })

    if (!client) {
      return null
    }

    return PrismaClientMapper.toDomain(client)
  }

  async findByEmail(email: string): Promise<Client | null> {
    const client = await this.prisma.user.findUnique({
      where: {
        email,
      },
    })

    if (!client) {
      return null
    }

    return PrismaClientMapper.toDomain(client)
  }

  async create(client: Client): Promise<void> {
    const data = PrismaClientMapper.toPrisma(client)

    await this.prisma.user.create({
      data,
    })
  }
}
