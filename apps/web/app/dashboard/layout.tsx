import { DashboardHeader } from '@/components/dashboard/dashboard-header'
import { Footer } from '@/components/footer'

interface DashboardLayoutProps {
  children?: React.ReactNode
}

export default async function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6">
        {children}
      </main>
      <Footer />
    </div>
  )
}
