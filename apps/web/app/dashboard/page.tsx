import { CreateButton } from '@/components/buttons/create'
import { Layout } from '@/components/layout'
import { DashboardSearchInput } from '@/components/search-input'

export const metadata = {
  title: 'Dashboard',
}

export default async function DashboardPage() {
  return (
    <Layout>
      <div className="flex w-full items-center gap-2">
        <DashboardSearchInput />
        <CreateButton />
      </div>

      <div></div>
    </Layout>
  )
}
