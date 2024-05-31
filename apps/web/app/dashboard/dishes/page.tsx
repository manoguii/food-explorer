import { Suspense } from 'react'

import { CreateButton } from '@/components/dashboard/button-create-new'
import { Dashboard } from '@/components/dashboard/dashboard-layout'
import { DashboardSearchInput } from '@/components/search-input'
import { TableSkeleton } from '@/components/skeletons'
import { DataTable } from '@/components/table/data-table'
import { fetchDishes } from '@/db/queries/fetch-dishes'

import { columns } from './columns'

export const metadata = {
  title: 'Dashboard',
}

export default function DishesPage({
  searchParams,
}: {
  searchParams?: {
    query?: string
    page?: string
  }
}) {
  const query = searchParams?.query || ''
  const currentPage = Number(searchParams?.page) || 1

  return (
    <Dashboard.Content>
      <div className="mb-6 flex w-full items-center gap-2">
        <DashboardSearchInput />
        <CreateButton />
      </div>
      <Suspense fallback={<TableSkeleton />}>
        <DataTableWrapper query={query} currentPage={currentPage} />
      </Suspense>
    </Dashboard.Content>
  )
}

async function DataTableWrapper({
  currentPage,
  query,
}: {
  query: string
  currentPage: number
}) {
  const { dishes, totalPages } = await fetchDishes({
    page: currentPage,
    query,
  })

  return (
    <DataTable
      withoutToolbar
      totalPages={totalPages}
      data={dishes}
      columns={columns}
    />
  )
}
