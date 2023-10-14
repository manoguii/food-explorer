import { Either, left, right } from '@/core/either'
import { ClientsRepository } from '../repositories/clients-repository'
import { HashGenerator } from '../cryptography/hash-generator'
import { Client } from '../../enterprise/entities/client'
import { ClientAlreadyExistsError } from './errors/client-already-exists-error'

interface RegisterClientUseCaseRequest {
  name: string
  email: string
  password: string
}

type RegisterClientUseCaseResponse = Either<
  ClientAlreadyExistsError,
  {
    client: Client
  }
>

export class RegisterClientUseCase {
  constructor(
    private clientsRepository: ClientsRepository,
    private hashGenerator: HashGenerator,
  ) {}

  async execute({
    name,
    email,
    password,
  }: RegisterClientUseCaseRequest): Promise<RegisterClientUseCaseResponse> {
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
