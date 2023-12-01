import { Suspense } from "react"
import { MixerHorizontalIcon } from "@radix-ui/react-icons"

import { fetchCategories } from "@/lib/data"
import { Button } from "@/components/ui/button"
import { CategoriesNav } from "@/components/categories-nav"
import { CardsSkeleton } from "@/components/skeletons"

import DishesList from "../../../components/dishes-list"

export default async function SearchPage({
  searchParams,
}: {
  searchParams?: {
    category?: string
    query?: string
    page?: string
  }
}) {
  const { categories } = await fetchCategories()

  const query = searchParams?.query || ""
  const category = searchParams?.category || ""
  const currentPage = Number(searchParams?.page) || 1

  let mode: "start" | "search" | "category"

  if (query) {
    mode = "search"
  } else if (category) {
    mode = "category"
  } else {
    mode = "start"
  }

  return (
    <div className="flex min-h-[calc(100vh-72px-40px)] w-full flex-col">
      {query && (
        <p className="mb-4 font-medium">
          Resultados para <span>{`"${query}"`}</span>
        </p>
      )}

      <div className="mb-4 flex items-center gap-2">
        <CategoriesNav categories={categories} />
        <Button variant="outline" size="sm" className="ml-auto lg:flex">
          <MixerHorizontalIcon className="mr-2 h-4 w-4" />
          View
        </Button>
      </div>

      <Suspense
        key={query + currentPage + category}
        fallback={<CardsSkeleton />}
      >
        <DishesList
          mode={mode}
          query={query}
          category={category}
          currentPage={currentPage}
        />
      </Suspense>
    </div>
  )
}
