import { Client } from '@/domain/restaurant/enterprise/entities/client'

export class ClientPresenter {
  static toHTTP(client: Client, accessToken: string) {
    return {
      id: client.id.toString(),
      name: client.name,
      email: client.email,
      access_token: accessToken,
    }
  }
}
