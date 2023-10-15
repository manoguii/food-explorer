import { Either, left, right } from '@/core/either'
import { ClientsRepository } from '../repositories/clients-repository'
import { HashGenerator } from '../cryptography/hash-generator'
import { Client } from '../../enterprise/entities/client'
import { ClientAlreadyExistsError } from './errors/client-already-exists-error'
import { Injectable } from '@nestjs/common'

interface CreateAccountUseCaseRequest {
  name: string
  email: string
  password: string
}

type CreateAccountUseCaseResponse = Either<
  ClientAlreadyExistsError,
  {
    client: Client
  }
>

@Injectable()
export class CreateAccountUseCase {
  constructor(
    private clientsRepository: ClientsRepository,
    private hashGenerator: HashGenerator,
  ) {}

  async execute({
    name,
    email,
    password,
  }: CreateAccountUseCaseRequest): Promise<CreateAccountUseCaseResponse> {
    const clientWithSameEmail = await this.clientsRepository.findByEmail(email)

    if (clientWithSameEmail) {
      return left(new ClientAlreadyExistsError(email))
    }

    const hashedPassword = await this.hashGenerator.hash(password)

    const client = Client.create({
      name,
      email,
      password: hashedPassword,
    })

    await this.clientsRepository.create(client)

    return right({
      client,
    })
  }
}
