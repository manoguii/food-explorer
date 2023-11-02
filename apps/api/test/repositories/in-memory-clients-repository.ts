import { DomainEvents } from '@/core/events/domain-events'
import { ClientsRepository } from '@/domain/restaurant/application/repositories/clients-repository'
import { Client } from '@/domain/restaurant/enterprise/entities/client'

export class InMemoryClientsRepository implements ClientsRepository {
  public items: Client[] = []

  async findById(id: string) {
    const client = this.items.find((item) => item.id.toString() === id)

    if (!client) {
      return null
    }

    return client
  }

  async findByEmail(email: string) {
    const client = this.items.find((item) => item.email === email)

    if (!client) {
      return null
    }

    return client
  }

  async create(client: Client) {
    this.items.push(client)

    DomainEvents.dispatchEventsForAggregate(client.id)
  }
}
