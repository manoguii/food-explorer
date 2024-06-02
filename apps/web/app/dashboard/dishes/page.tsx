import { PlusCircle } from 'lucide-react'
import Link from 'next/link'
import { Suspense } from 'react'

import { Dashboard } from '@/components/dashboard/dashboard-layout'
import { DashboardSearchInput } from '@/components/search-input'
import { TableSkeleton } from '@/components/skeletons'
import { DataTable } from '@/components/table/data-table'
import { buttonVariants } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { fetchDishes } from '@/db/queries/fetch-dishes'
import { cn } from '@/lib/utils'

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
      </div>
      <Tabs defaultValue="all">
        <div className="flex items-center">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="draft">Draft</TabsTrigger>
            <TabsTrigger value="archived" className="hidden sm:flex">
              Archived
            </TabsTrigger>
          </TabsList>
          <div className="ml-auto flex items-center gap-2">
            <Link
              href={`/dashboard/dishes/create`}
              className={cn('gap-1', buttonVariants())}
            >
              <PlusCircle className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                Criar prato
              </span>
            </Link>
          </div>
        </div>
        <TabsContent value="all">
          <Card x-chunk="dashboard-06-chunk-0">
            <CardHeader>
              <CardTitle>Pratos do restaurante</CardTitle>
              <CardDescription>
                Gerenciar todos pratos do food explorer, editar e remover pratos
                disponíveis.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Suspense fallback={<TableSkeleton />}>
                <DataTableWrapper query={query} currentPage={currentPage} />
              </Suspense>
            </CardContent>
            <CardFooter>
              <div className="text-xs text-muted-foreground">
                Showing <strong>1-10</strong> of <strong>32</strong> products
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
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
