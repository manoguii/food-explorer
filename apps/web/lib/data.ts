import type { User } from '@/lib/types/definitions'
import { Category, Dish } from '@/lib/types/definitions'
import { fetchWithToken } from '@/lib/utils'

interface FetchOrdersResponse {
  orders: {
    id: string
    details: string
    code: string
    status: 'PENDING' | 'PREPARING' | 'DELIVERED' | 'CANCELED'
    label: 'TABLE' | 'DELIVERY' | 'TAKEOUT'
    priority: 'LOW' | 'MEDIUM' | 'HIGH'
    createdAt: string
    updatedAt: string | null
  }[]
  totalPages: number
}

interface GetOrderResponse {
  id: string
  status: 'PENDING' | 'PREPARING' | 'DELIVERED' | 'CANCELED'
  code: string
  createdAt: string
  updatedAt: string
  dishes: {
    id: string
    name: string
    description: string
    price: number
    slug: string
    attachments: {
      id: string
      title: string
      url: string
    }[]
    quantity: number
    status: 'PENDING' | 'PREPARING' | 'DELIVERED' | 'CANCELED'
  }[]
}

export async function fetchFavoriteDishes(page: number): Promise<{
  favoriteDishes: Dish[]
  totalPages: number
}> {
  const response = await fetchWithToken(
    `http://localhost:3333/dish/favorites?page=${page}`,
    {
      next: {
        tags: ['favorite-dishes'],
      },
    },
  )

  const favoriteDishes = await response.json()

  return favoriteDishes
}

export async function fetchCategories(): Promise<{
  categories: Category[]
  totalPages: number
}> {
  const response = await fetchWithToken('http://localhost:3333/categories')

  const categories = await response.json()

  return categories
}

export async function getDishBySlug(slug: string): Promise<Dish> {
  const response = await fetchWithToken(`http://localhost:3333/dishes/${slug}`)
  const data = await response.json()

  return data.dish
}

export async function fetchDishesByCategory(
  category: string,
  page: number,
): Promise<{
  dishes: Dish[]
  totalPages: number
}> {
  const response = await fetchWithToken(
    `http://localhost:3333/dish/${category}?page=${page}`,
    {
      next: {
        tags: ['dishes-by-category'],
      },
    },
  )
  const dishes = await response.json()

  return dishes
}

export async function fetchDishes({
  page,
  query,
}: {
  page?: number
  query?: string
}): Promise<{
  dishes: Dish[]
  totalPages: number
}> {
  const response = await fetchWithToken(
    `http://localhost:3333/dishes?page=${page}&query=${query}`,
    {
      next: {
        tags: ['all-dishes'],
      },
    },
  )
  const dishes = await response.json()

  return dishes
}

export async function fetchOrders(): Promise<FetchOrdersResponse> {
  const response = await fetchWithToken('http://localhost:3333/orders')

  const orders = await response.json()

  return orders
}

export async function getOrderById(orderId: string): Promise<GetOrderResponse> {
  const response = await fetchWithToken(
    `http://localhost:3333/orders/${orderId}`,
  )

  const { order } = await response.json()

  return order
}

export async function getUserSession(credentials: {
  email: string
  password: string
}): Promise<User | null> {
  const response = await fetchWithToken('http://localhost:3333/sessions', {
    method: 'POST',
    body: JSON.stringify(credentials),
    headers: {
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    return null
  }

  const { user } = await response.json()

  return user
}
