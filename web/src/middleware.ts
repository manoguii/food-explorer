import { withAuth } from 'next-auth/middleware'

export default withAuth({
  pages: {
    signIn: '/auth/sign-in',
  },
})

export const config = {
  matcher: [
    '/((?!api/webhooks|auth/sign-up|auth/sign-in|_next/static|_next/image|favicon.ico).*)',
  ],
}
