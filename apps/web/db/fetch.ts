'use server'

import {
  FetchCategoriesResponse,
  FetchDishesResponse,
  FetchFavoriteDishesResponse,
  FetchOrdersResponse,
  GetDishBySlugResponse,
  GetOrderByIdResponse,
  GetUserSessionResponse,
} from '@/lib/types/definitions'

import { fetcher } from './utils'

export async function fetchFavoriteDishes(page: number) {
  try {
    const endpoint = `/dish/favorites?page=${page}`

    const favoriteDishes = await fetcher<FetchFavoriteDishesResponse>(endpoint)

    return favoriteDishes
  } catch (error) {
    console.error(error)
    return {
      favoriteDishes: [],
      totalPages: 0,
    }
  }
}

export async function fetchCategories() {
  try {
    const endpoint = '/categories'
    const categories = await fetcher<FetchCategoriesResponse>(endpoint)

    return categories
  } catch (error) {
    console.error(error)
    return {
      categories: [],
      totalPages: 0,
    }
  }
}

export async function getDishBySlug(slug: string) {
  try {
    const endpoint = `/dishes/${slug}`
    const { dish } = await fetcher<GetDishBySlugResponse>(endpoint)

    return dish
  } catch (error) {
    console.error(error)
    return null
  }
}

export async function fetchDishesByCategory(category: string, page: number) {
  try {
    const endpoint = `/dish/${category}?page=${page}`
    const dishes = await fetcher<FetchDishesResponse>(endpoint, {})

    return dishes
  } catch (error) {
    console.error(error)
    return {
      dishes: [],
      totalPages: 0,
    }
  }
}

export async function fetchDishes({
  page,
  query,
}: {
  page?: number
  query?: string
}): Promise<FetchDishesResponse> {
  try {
    const endpoint = `/dishes?page=${page}&query=${query}`
    const dishes = await fetcher<FetchDishesResponse>(endpoint)

    return dishes
  } catch (error) {
    console.error(error)
    return {
      dishes: [],
      totalPages: 0,
    }
  }
}

export async function fetchOrders(): Promise<FetchOrdersResponse> {
  try {
    const endpoint = '/orders'
    const orders = await fetcher<FetchOrdersResponse>(endpoint)

    return orders
  } catch (error) {
    console.error(error)
    return {
      orders: [],
      totalPages: 0,
    }
  }
}

export async function getOrderById(orderId: string) {
  try {
    const endpoint = `/orders/${orderId}`
    const { order } = await fetcher<GetOrderByIdResponse>(endpoint)

    return order
  } catch (error) {
    console.error(error)
    return null
  }
}

export async function getUserSession(credentials: {
  email: string
  password: string
}) {
  try {
    const endpoint = '/sessions'
    const { user } = await fetcher<GetUserSessionResponse>(endpoint, {
      method: 'POST',
      body: JSON.stringify(credentials),
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!user) {
      return null
    }

    return user
  } catch (error) {
    console.error(error)
    return null
  }
}
