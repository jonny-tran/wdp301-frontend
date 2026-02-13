'use client'

import { BasePagination } from '@/components/layout/BasePagination'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useCallback } from 'react'


interface PaginationProps {
    totalPages: number
    currentPage: number
    totalItems?: number
    itemsPerPage?: number
}

export function Pagination({ totalPages, currentPage, totalItems, itemsPerPage }: PaginationProps) {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()

    const createQueryString = useCallback(
        (name: string, value: string) => {
            const params = new URLSearchParams(searchParams.toString())
            params.set(name, value)
            return params.toString()
        },
        [searchParams]
    )

    const handlePageChange = (page: number) => {
        router.push(pathname + '?' + createQueryString('page', page.toString()))
    }

    if (totalPages <= 1) return null

    return (
        <BasePagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            totalItems={totalItems}
            itemsPerPage={itemsPerPage}
        />
    )
}
