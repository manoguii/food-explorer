/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import NextAuth from 'next-auth'
import NextAuth from 'next-auth/next'

import { User } from './definitions'

declare module 'next-auth' {
  interface Session {
    user: User
  }
}
