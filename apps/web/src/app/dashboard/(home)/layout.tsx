import React from 'react'
import { CategoriesNav } from './categories-nav'
import { fetchCategories } from '@/lib/data'
import { getAuthToken } from '@/app/actions'
import { SectionForYou } from './section-for-you'
import { Button } from '@/components/ui/button'
import { MixerHorizontalIcon } from '@radix-ui/react-icons'

export default async function HomeLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const token = await getAuthToken()
  const categories = await fetchCategories(token)

  return (
    <div className="container relative space-y-8">
      <section>
        <h2 className="mb-4 text-xl font-bold text-primary">Categorias</h2>
      </section>

      <section className="space-y-4">
        <h2 className="mb-4 text-xl font-bold text-primary">Pra você</h2>
        <SectionForYou />
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-bold text-primary">Pratos disponíveis</h2>

        <div className="flex items-center gap-2">
          <CategoriesNav categories={categories} />

          <Button variant="outline" size="sm" className="ml-auto lg:flex">
            <MixerHorizontalIcon className="mr-2 h-4 w-4" />
            View
          </Button>
        </div>

        <div className="overflow-hidden rounded-[0.5rem]">{children}</div>
      </section>
    </div>
  )
}
