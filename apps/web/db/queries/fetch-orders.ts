import { OrderWithDetails } from '@/lib/types/definitions'

import { fetcher } from '../utils'

export type FetchOrdersResponse = {
  orders: OrderWithDetails[]
  totalPages: number
}

export async function fetchOrders() {
  const endpoint = '/orders'
  const orders = await fetcher<FetchOrdersResponse>(endpoint)

  return orders
}
