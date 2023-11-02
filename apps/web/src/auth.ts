import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { authConfig } from './auth.config'
import { z } from 'zod'
import type { User } from '@/lib/definitions'

async function getUserSession(credentials: {
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

  const user = await response.json()

  return user
}

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

          if (!user) return null

          return user
        }

        console.log('Invalid credentials')
        return null
      },
    }),
  ],
})
