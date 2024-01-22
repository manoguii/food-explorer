import { OrderWithDetails } from '@/lib/types/definitions'

import { fetcher } from '../utils'

export type GetOrderByIdResponse = {
  order: OrderWithDetails
}
export async function getOrderById(id: string) {
  const endpoint = `/order/${id}`
  const { order } = await fetcher<GetOrderByIdResponse>(endpoint)

  return order
}
