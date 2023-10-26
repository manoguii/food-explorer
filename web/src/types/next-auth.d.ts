/* eslint-disable @typescript-eslint/no-unused-vars */
import NextAuth from 'next-auth/next'
import NextAuth from 'next-auth'
import { JWT } from 'next-auth/jwt'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      name: string
      email: string
      access_token: string
    }
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    user: {
      id: string
      name: string
      email: string
      access_token: string
    }
  }
}
