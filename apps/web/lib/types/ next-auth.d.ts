/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import NextAuth from 'next-auth/next'
import NextAuth from 'next-auth'
import { User } from './definitions'

declare module 'next-auth' {
  interface Session {
    user: User
  }
}
