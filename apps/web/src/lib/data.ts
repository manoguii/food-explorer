import type { User } from '@/lib/types/definitions'
import { Category, Dish } from '@/lib/types/definitions'

interface GetDishesResponse {
  dishes: {
    category: string
    items: Dish[]
  }[]
}

export async function getFavoriteDishes(token: string): Promise<Dish[]> {
  const response = await fetch('http://localhost:3333/dish/favorites', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    next: {
      tags: ['favorite-dishes'],
    },
  })

  const favoriteDishes = await response.json()

  return favoriteDishes.dishes
}

export async function getCategories(token: string): Promise<Category[]> {
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

  const { categories } = await response.json()

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

export async function getDishes(token: string): Promise<GetDishesResponse> {
  const response = await fetch(
    'http://localhost:3333/dish/categories?categories=Saladas&categories=Refeições&categories=Sobremesas',
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
