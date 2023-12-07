import { Suspense } from 'react'

import { CreateButton } from '@/components/buttons/create'
import { Layout } from '@/components/layout'
import ListManageDishes from '@/components/list-manage-dishes'
import { SearchInput } from '@/components/search-input'
import { CardsSkeleton } from '@/components/skeletons'

export const metadata = {
  title: 'Dashboard',
}

export default async function DashboardPage({
  searchParams,
}: {
  searchParams?: {
    query?: string
    page?: string
  }
}) {
  const query = searchParams?.query || ''
  const currentPage = Number(searchParams?.page) || 1

  let mode: 'all' | 'search'

  if (query) {
    mode = 'search'
  } else {
    mode = 'all'
  }

  return (
    <Layout>
      <div className="flex w-full items-center gap-2">
        <SearchInput />
        <CreateButton />
      </div>

      <Suspense key={query + currentPage} fallback={<CardsSkeleton />}>
        <ListManageDishes mode={mode} query={query} currentPage={currentPage} />
      </Suspense>
    </Layout>
  )
}
