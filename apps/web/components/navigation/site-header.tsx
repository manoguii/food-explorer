import { MobileNav } from './mobile-nav'
import { UserAccountNav } from './user-nav'
import { auth } from '@/auth'
import { notFound } from 'next/navigation'

export async function SiteHeader() {
  const session = await auth()

  if (!session) {
    return notFound()
  }

  const { user } = session

  return (
    <header className="sticky top-0 z-50 block w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 md:hidden">
      <div className="flex items-center justify-between p-2">
        <MobileNav />

        <nav className="flex items-center gap-2">
          <UserAccountNav user={user} />
        </nav>
      </div>
    </header>
  )
}
