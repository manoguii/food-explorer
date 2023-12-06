import { DashboardShell } from '@/components/dashboard-layout'

export const metadata = {
  title: 'Dashboard',
}

export default async function DashboardPage() {
  return <DashboardShell>Hello overview</DashboardShell>
}
