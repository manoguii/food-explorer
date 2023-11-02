import { NextAuthOptions } from 'next-auth'
import NextAuth from 'next-auth/next'
import CredentialsProvider from 'next-auth/providers/credentials'

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: {
          label: 'Email',
          type: 'text',
          placeholder: 'johndoe@example.com',
        },
        password: {
          label: 'Password',
          type: 'password',
          placeholder: '********',
        },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        const res = await fetch('http://localhost:3333/sessions', {
          method: 'POST',
          body: JSON.stringify(credentials),
          headers: {
            'Content-Type': 'application/json',
          },
        })

        if (res.status === 401) {
          return null
        }

        const user = await res.json()
        console.log({ user })
        return user
      },
    }),
  ],

  pages: {
    signIn: '/auth/sign-in',
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) return { ...token, ...user }

      return token
    },

    async session({ token, session }) {
      session.user = token.user
      session.user.access_token = token.user.access_token

      return session
    },
  },
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
