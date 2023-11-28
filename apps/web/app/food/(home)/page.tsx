import { Suspense } from "react"
import { MixerHorizontalIcon } from "@radix-ui/react-icons"

import { fetchCategories } from "@/lib/data"
import { Button } from "@/components/ui/button"
import { CategoriesNav } from "@/components/categories-nav"
import { SearchInput } from "@/components/search-input"
import { CardsSkeleton } from "@/components/skeletons"
import { getAuthToken, getCurrentUser } from "@/app/actions"

import DishesList from "../../../components/dishes-list"

export default async function Home({
  searchParams,
}: {
  searchParams?: {
    category?: string
    query?: string
    page?: string
  }
}) {
  const [user, token] = await Promise.all([getCurrentUser(), getAuthToken()])
  const { categories } = await fetchCategories(token)

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
    <div className="flex flex-col gap-4">
      <h1 className="truncate text-xl font-semibold text-primary">
        Ola,{" "}
        <span className="font-bold">{user.name.split(" ").slice(0, 1)}</span>
      </h1>

      <SearchInput />

      <div className="flex items-center gap-2">
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
