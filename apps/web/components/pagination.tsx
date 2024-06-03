'use client'

import { usePathname, useSearchParams } from 'next/navigation'

import {
  Pagination as PaginationRoot,
  PaginationContent,
  PaginationEllipsis,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import { cn, generatePagination } from '@/lib/utils'

interface PaginationProps {
  totalPages: number
}

export function Pagination({ totalPages }: PaginationProps) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const currentPage = Number(searchParams.get('page')) || 1
  const allPages = generatePagination(currentPage, totalPages)

  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams)
    params.set('page', pageNumber.toString())
    return `${pathname}?${params.toString()}`
  }

  return (
    <PaginationRoot>
      <PaginationContent className="gap-4">
        <PaginationPrevious
          href={createPageURL(currentPage - 1)}
          isDisabled={currentPage <= 1}
        />

        <div className="flex">
          {allPages.map((page, index) => {
            let position: 'first' | 'last' | 'single' | 'middle' | undefined

            if (index === 0) position = 'first'
            if (index === allPages.length - 1) position = 'last'
            if (allPages.length === 1) position = 'single'
            if (page === '...') position = 'middle'

            return position === 'middle' ? (
              <PaginationEllipsis key={page} />
            ) : (
              <PaginationLink
                key={page}
                href={createPageURL(page)}
                isActive={currentPage === page}
                className={cn(
                  'rounded-none',
                  position === 'first'
                    ? 'rounded-l-md'
                    : position === 'last'
                      ? 'rounded-r-md'
                      : position === 'single'
                        ? 'rounded-md'
                        : '',
                )}
                isDisabled={page === '...'}
              >
                {page}
              </PaginationLink>
            )
          })}
        </div>

        <PaginationNext
          href={createPageURL(currentPage + 1)}
          isDisabled={currentPage >= totalPages}
        />
      </PaginationContent>
    </PaginationRoot>
  )
}
