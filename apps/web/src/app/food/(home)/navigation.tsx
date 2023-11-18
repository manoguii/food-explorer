import React from 'react'
import { CategoriesNav } from './categories-nav'
import { Button } from '@/components/ui/button'
import { MixerHorizontalIcon } from '@radix-ui/react-icons'
import { fetchCategories } from '@/lib/data'
import { getAuthToken } from '@/app/actions'

export default async function Navigation() {
  const token = await getAuthToken()
  const { categories } = await fetchCategories(token)

  return (
    <div className="flex items-center gap-2">
      <CategoriesNav categories={categories} />
      <Button variant="outline" size="sm" className="ml-auto lg:flex">
        <MixerHorizontalIcon className="mr-2 h-4 w-4" />
        View
      </Button>
    </div>
  )
}
