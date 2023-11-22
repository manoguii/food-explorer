/* eslint-disable @typescript-eslint/no-unused-vars */
import NextAuth from 'next-auth/next'
import NextAuth from 'next-auth'
import { JWT } from 'next-auth/jwt'
import { User } from './definitions'

declare module 'next-auth' {
  interface Session {
    user: User
  }
}
