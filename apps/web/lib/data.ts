import type { User } from '@/lib/types/definitions'
import { Category, Dish } from '@/lib/types/definitions'

interface FetchOrdersResponse {
  orders: {
    id: string
    details: string
    code: string
    status: 'PENDING' | 'PREPARING' | 'DELIVERED' | 'CANCELED'
    label: 'TABLE' | 'DELIVERY' | 'TAKEOUT'
    priority: 'LOW' | 'MEDIUM' | 'HIGH'
    createdAt: Date
    updatedAt: Date | null
  }[]
  totalPages: number
}

export async function fetchFavoriteDishes(
  token: string,
  page: number,
): Promise<{
  favoriteDishes: Dish[]
  totalPages: number
}> {
  const response = await fetch(
    `http://localhost:3333/dish/favorites?page=${page}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      next: {
        tags: ['favorite-dishes'],
      },
    },
  )

  const favoriteDishes = await response.json()

  return favoriteDishes
}

export async function fetchCategories(token: string): Promise<{
  categories: Category[]
  totalPages: number
}> {
  const response = await fetch('http://localhost:3333/categories', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    next: {
      tags: ['Categories'],
    },
  })

  const categories = await response.json()

  return categories
}

export async function getDishBySlug(
  slug: string,
  token: string,
): Promise<Dish> {
  const response = await fetch(`http://localhost:3333/dishes/${slug}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  const data = await response.json()

  return data.dish
}

export async function fetchDishesByCategory(
  token: string,
  category: string,
  page: number,
): Promise<{
  dishes: Dish[]
  totalPages: number
}> {
  const response = await fetch(
    `http://localhost:3333/dish/${category}?page=${page}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      next: {
        tags: ['featured-dishes'],
      },
    },
  )
  const dishes = await response.json()

  return dishes
}

export async function fetchDishes(
  token: string,
  {
    page,
    query,
  }: {
    page?: number
    query?: string
  },
): Promise<{
  dishes: Dish[]
  totalPages: number
}> {
  const response = await fetch(
    `http://localhost:3333/dishes?page=${page}&query=${query}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      next: {
        tags: ['all-dishes'],
      },
    },
  )
  const dishes = await response.json()

  return dishes
}

export async function fetchOrders(token: string): Promise<FetchOrdersResponse> {
  const response = await fetch(`http://localhost:3333/orders`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  const orders = await response.json()

  return orders
}

export async function getUserSession(credentials: {
  email: string
  password: string
}): Promise<User | null> {
  const response = await fetch('http://localhost:3333/sessions', {
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
