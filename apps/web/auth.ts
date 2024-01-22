import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { z } from 'zod'

import { authConfig } from './auth.config'
import { fetcher } from './db/utils'
import { User } from './lib/types/definitions'

export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials)

        if (parsedCredentials.success) {
          const user = await getUserSession(parsedCredentials.data)

          if (user) return user
        }

        return null
      },
    }),
  ],
})

export type GetUserSessionResponse = {
  user: User
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
