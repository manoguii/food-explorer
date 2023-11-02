import type { NextAuthConfig } from 'next-auth'

export const authConfig = {
  providers: [],
  pages: {
    signIn: '/auth/sign-in',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const isOnApp = nextUrl.pathname.startsWith('/app')

      if (isOnApp) {
        if (isLoggedIn) return true
        return false // Redirect unauthenticated users to login page
      } else if (isLoggedIn) {
        return Response.redirect(new URL('/app', nextUrl))
      }
      return true
    },
  },
} satisfies NextAuthConfig
