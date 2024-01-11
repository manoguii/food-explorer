import { fetchDishes } from '@/lib/data'
import { CreateButton } from '@/components/buttons/create'
import { Layout } from '@/components/layout'
import { DashboardSearchInput } from '@/components/search-input'
import { DataTable } from '@/components/table/data-table'

import { columns } from './columns'

export const metadata = {
  title: 'Dashboard',
}

export default async function DishesPage({
  searchParams,
}: {
  searchParams?: {
    query?: string
    page?: string
  }
}) {
  const query = searchParams?.query || ''
  const currentPage = Number(searchParams?.page) || 1

  const { dishes, totalPages } = await fetchDishes({
    page: currentPage,
    query,
  })

  return (
    <Layout>
      <div className="flex w-full items-center gap-2">
        <DashboardSearchInput />
        <CreateButton />
      </div>

      <DataTable totalPages={totalPages} data={dishes} columns={columns} />
    </Layout>
  )
}
