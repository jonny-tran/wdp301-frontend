'use client'

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from '@/components/ui/pagination'

import { cn } from '@/lib/utils'

interface Props {
  currentPage: number
  totalPages: number
  totalItems?: number
  itemsPerPage?: number
  onPageChange: (page: number) => void
}

export function BasePagination({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
}: Props) {
  if (!totalPages) return null

  const page = Math.min(Math.max(currentPage, 1), totalPages)

  const start =
    totalItems && itemsPerPage
      ? (page - 1) * itemsPerPage + 1
      : 0

  const end =
    totalItems && itemsPerPage
      ? Math.min(page * itemsPerPage, totalItems)
      : 0

  const pages = (() => {
    const arr: (number | string)[] = []

    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) arr.push(i)
    } else if (page <= 3) {
      arr.push(1, 2, 3, 4, '...', totalPages)
    } else if (page >= totalPages - 2) {
      arr.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages)
    } else {
      arr.push(1, '...', page - 1, page, page + 1, '...', totalPages)
    }

    return arr
  })()

  return (
    <div className="flex items-center justify-between mt-6 border-t border-gray-100 pt-5">
      <p className="text-[11px] font-bold uppercase tracking-widest text-slate-600">
        {totalItems ? (
          <>
            Showing <span className="text-slate-900">{start}-{end}</span> of{' '}
            <span className="text-slate-900">{totalItems}</span>
          </>
        ) : (
          <>
            Page <span className="text-slate-900">{page}</span> / {totalPages}
          </>
        )}
      </p>

      <Pagination className="mx-0 w-auto">
        <PaginationContent className="gap-1.5">
          <PaginationItem>
            <PaginationPrevious
              onClick={() => page > 1 && onPageChange(page - 1)}
              className={cn(
                'h-9 rounded-lg border border-slate-300 bg-white px-3 hover:border-primary hover:text-primary transition-all text-slate-700 font-bold text-[11px] uppercase tracking-wider',
                page === 1 && 'pointer-events-none text-slate-300 border-gray-100'
              )}
            />
          </PaginationItem>

          {pages.map((p, i) => (
            <PaginationItem key={i}>
              {p === '...' ? (
                <PaginationEllipsis className="text-slate-400" />
              ) : (
                <PaginationLink
                  isActive={p === page}
                  onClick={() => onPageChange(p as number)}
                  className={cn(
                    'h-9 w-9 rounded-lg border text-sm font-bold transition-all flex items-center justify-center',
                    p === page
                      ? 'bg-slate-900 border-slate-900 text-white shadow-lg shadow-slate-900/20 scale-105'
                      : 'border-slate-300 bg-white text-slate-600 hover:text-slate-900 hover:border-slate-600'
                  )}
                >
                  {p}
                </PaginationLink>
              )}
            </PaginationItem>
          ))}

          <PaginationItem>
            <PaginationNext
              onClick={() => page < totalPages && onPageChange(page + 1)}
              className={cn(
                'h-9 rounded-lg border border-slate-300 bg-white px-3 hover:border-primary hover:text-primary transition-all text-slate-700 font-bold text-[11px] uppercase tracking-wider',
                page === totalPages && 'pointer-events-none text-slate-300 border-gray-100'
              )}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  )
}