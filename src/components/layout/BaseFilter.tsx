'use client'

import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { useCallback, useState, useEffect } from 'react'

export type FilterType = 'text' | 'select' | 'date' | 'number'

export interface FilterOption {
    label: string
    value: string | number
}

export interface FilterConfig {
    key: string
    label: string
    type: FilterType
    placeholder?: string
    options?: FilterOption[]
    defaultValue?: string | number
    className?: string // col-span-2 etc
}

interface BaseFilterProps {
    filters: FilterConfig[]
    onFilterChange?: (key: string, value: any) => void
    defaultValues?: Record<string, any>
}

export default function BaseFilter({ filters, onFilterChange }: BaseFilterProps) {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()

    // Initialize local state for text inputs (debounce)
    const [localState, setLocalState] = useState<Record<string, string>>(() => {
        const initialState: Record<string, string> = {}
        filters.forEach(filter => {
            if (filter.type === 'text') {
                initialState[filter.key] = searchParams.get(filter.key) || (filter.defaultValue as string) || ''
            }
        })
        return initialState
    })

    const createQueryString = useCallback(
        (params: Record<string, string | number | null>) => {
            const newSearchParams = new URLSearchParams(searchParams.toString())

            Object.entries(params).forEach(([key, value]) => {
                if (value === null || value === '' || value === undefined) {
                    newSearchParams.delete(key)
                } else {
                    newSearchParams.set(key, String(value))
                }
            })

            // Reset page on filter change
            if (params.page === undefined) {
                newSearchParams.set('page', '1')
            }

            return newSearchParams.toString()
        },
        [searchParams]
    )

    const updateURL = (key: string, value: string | null) => {
        router.push(pathname + '?' + createQueryString({ [key]: value }))
        if (onFilterChange) {
            onFilterChange(key, value)
        }
    }

    // Debounce effect just for text inputs in localState
    useEffect(() => {
        const timer = setTimeout(() => {
            Object.keys(localState).forEach(key => {
                const currentParam = searchParams.get(key) || ''
                if (localState[key] !== currentParam) {
                    updateURL(key, localState[key])
                }
            })
        }, 500)

        return () => clearTimeout(timer)
    }, [localState]) // Logic: when localState changes, debounce update URL

    const handleValuesChange = (key: string, value: string) => {
        // for text inputs, only update local state, effect will handle URL update
        const filterDef = filters.find(f => f.key === key)
        if (filterDef?.type === 'text') {
            setLocalState(prev => ({ ...prev, [key]: value }))
        } else {
            // for select/date, update URL immediately
            updateURL(key, value)
        }
    }

    // Clear all filters
    const clearFilters = () => {
        router.push(pathname)
        // Also reset local state
        const resetState: Record<string, string> = {}
        filters.forEach(filter => {
            if (filter.type === 'text') {
                resetState[filter.key] = ''
            }
        })
        setLocalState(resetState)
    }

    return (
        <div className="bg-white p-4 rounded-lg shadow-sm mb-6 border border-gray-100 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {filters.map((filter) => {
                const paramValue = searchParams.get(filter.key)
                const value = filter.type === 'text'
                    ? (localState[filter.key] !== undefined ? localState[filter.key] : (paramValue || ''))
                    : (paramValue || filter.defaultValue || '')

                return (
                    <div key={filter.key} className={filter.className || ""}>
                        <label className="block text-sm font-medium text-gray-700 mb-1">{filter.label}</label>

                        {filter.type === 'text' && (
                            <input
                                type="text"
                                placeholder={filter.placeholder}
                                value={value}
                                onChange={(e) => handleValuesChange(filter.key, e.target.value)}
                                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        )}

                        {filter.type === 'select' && (
                            <select
                                value={value}
                                onChange={(e) => handleValuesChange(filter.key, e.target.value)}
                                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            >
                                <option value="">All</option>
                                {filter.options?.map((opt) => (
                                    <option key={opt.value} value={opt.value}>
                                        {opt.label}
                                    </option>
                                ))}
                            </select>
                        )}

                        {filter.type === 'date' && (
                            <input
                                type="date"
                                value={value}
                                onChange={(e) => handleValuesChange(filter.key, e.target.value)}
                                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        )}
                    </div>
                )
            })}

            <div className="flex items-end">
                <button
                    onClick={clearFilters}
                    className="w-full rounded-md bg-gray-100 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                    Clear Filters
                </button>
            </div>
        </div>
    )
}
