import React from 'react'
import { CategoriesNav } from './categories-nav'
import { Hero } from './hero'
import { fetchCategories } from '@/lib/data'
import { getAuthToken } from '@/app/actions'

export default async function HomeLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const token = await getAuthToken()
  const categories = await fetchCategories(token)

  return (
    <>
      <div className="container relative space-y-8">
        <Hero />
        <section className="space-y-4">
          <CategoriesNav categories={categories} />
          <div className="overflow-hidden rounded-[0.5rem]">{children}</div>
        </section>
      </div>
    </>
  )
}
