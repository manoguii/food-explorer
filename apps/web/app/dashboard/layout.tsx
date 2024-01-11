import { DashboardHeader } from '@/components/dashboard/header'
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
      <main className="w-full flex-1">{children}</main>
      <Footer />
    </div>
  )
}
