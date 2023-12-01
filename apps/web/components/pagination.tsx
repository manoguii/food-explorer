"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"
import clsx from "clsx"
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react"

import { generatePagination } from "@/lib/utils"

export function Pagination({ totalPages }: { totalPages: number }) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const currentPage = Number(searchParams.get("page")) || 1
  const allPages = generatePagination(currentPage, totalPages)

  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams)
    params.set("page", pageNumber.toString())
    return `${pathname}?${params.toString()}`
  }

  return (
    <div className="mx-auto mt-auto inline-flex self-center">
      <PaginationArrow
        direction="left"
        href={createPageURL(currentPage - 1)}
        isDisabled={currentPage <= 1}
      />

      <div className="flex -space-x-px">
        {allPages.map((page, index) => {
          let position: "first" | "last" | "single" | "middle" | undefined

          if (index === 0) position = "first"
          if (index === allPages.length - 1) position = "last"
          if (allPages.length === 1) position = "single"
          if (page === "...") position = "middle"

          return (
            <PaginationNumber
              key={page}
              href={createPageURL(page)}
              page={page}
              position={position}
              isActive={currentPage === page}
            />
          )
        })}
      </div>

      <PaginationArrow
        direction="right"
        href={createPageURL(currentPage + 1)}
        isDisabled={currentPage >= totalPages}
      />
    </div>
  )
}

function PaginationNumber({
  page,
  href,
  isActive,
  position,
}: {
  page: number | string
  href: string
  position?: "first" | "last" | "middle" | "single"
  isActive: boolean
}) {
  const { replace } = useRouter()
  const className = clsx(
    "flex h-10 w-10 items-center justify-center border text-sm",
    {
      "rounded-l-md": position === "first" || position === "single",
      "rounded-r-md": position === "last" || position === "single",
      "z-10 bg-blue-600 border-blue-600 text-white": isActive,
      "border border-input bg-background hover:bg-accent hover:text-accent-foreground":
        !isActive && position !== "middle",
      "text-gray-300": position === "middle",
    }
  )

  return isActive || position === "middle" ? (
    <div className={className}>{page}</div>
  ) : (
    <button
      className={className}
      onClick={() => {
        replace(href, { scroll: false })
      }}
    >
      {page}
    </button>
  )
}

function PaginationArrow({
  href,
  direction,
  isDisabled,
}: {
  href: string
  direction: "left" | "right"
  isDisabled?: boolean
}) {
  const { replace } = useRouter()
  const className = clsx(
    "flex h-10 w-10 items-center justify-center rounded-md border",
    {
      "pointer-events-none text-gray-300 dark:text-gray-700": isDisabled,
      "bg-primary text-primary-foreground hover:bg-primary/90": !isDisabled,
      "mr-2 md:mr-4": direction === "left",
      "ml-2 md:ml-4": direction === "right",
    }
  )

  const icon =
    direction === "left" ? (
      <ArrowLeftIcon className="w-4" />
    ) : (
      <ArrowRightIcon className="w-4" />
    )

  return isDisabled ? (
    <div className={className}>{icon}</div>
  ) : (
    <button
      className={className}
      onClick={() => {
        replace(href, { scroll: false })
      }}
    >
      {icon}
    </button>
  )
}
