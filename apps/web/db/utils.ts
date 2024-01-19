'use server'

import { auth } from '@/auth'

const BASE_URL = process.env.API_BASE_URL || ''

interface FetchError {
  status: number
  message: string
}

type FetcherFn = <T>(input: RequestInfo, init?: RequestInit) => Promise<T>

export const fetcher: FetcherFn = async <T>(
  input: RequestInfo,
  init?: RequestInit,
) => {
  try {
    const session = await auth()
    const token = session?.user?.access_token

    const isUpload = init?.body instanceof FormData

    const headers = isUpload
      ? { Authorization: `Bearer ${token}`, ...init?.headers }
      : {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
          ...init?.headers,
        }

    const response = await fetch(`${BASE_URL}${input}`, { ...init, headers })

    if (!response.ok) {
      const data: FetchError = await response.json()
      throw {
        status: response.status,
        message: data.message,
      }
    }

    const text = await response.text()

    if (!text) {
      return {} as T
    }

    return JSON.parse(text) as T
  } catch (error) {
    throw {
      error,
    }
  }
}
