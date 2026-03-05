'use client'

import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

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
  width?: string
  className?: string
}

interface Props {
  filters: FilterConfig[]
}

export default function BaseFilter({ filters }: Props) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [local, setLocal] = useState<Record<string, string>>({})

  const control =
    'h-9 rounded-lg border border-slate-300 bg-white px-3 text-sm outline-none transition focus:border-primary/50 focus:ring-2 focus:ring-primary/15 text-slate-700'

  const updateURL = (updates: Record<string, string | number | null>) => {
    const params = new URLSearchParams(searchParams.toString())

    Object.entries(updates).forEach(([k, v]) => {
      if (!v) params.delete(k)
      else params.set(k, String(v))
    })

    params.set('page', '1')

    router.push(`${pathname}?${params.toString()}`)
  }

  const handleChange = (key: string, value: string) => {
    const type = filters.find(f => f.key === key)?.type

    if (type === 'text') {
      setLocal(prev => ({ ...prev, [key]: value }))
    } else {
      updateURL({ [key]: value })
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      const updates: Record<string, string> = {}

      Object.entries(local).forEach(([k, v]) => {
        if ((searchParams.get(k) ?? '') !== v) updates[k] = v
      })

      if (Object.keys(updates).length) updateURL(updates)
    }, 400)

    return () => clearTimeout(timer)
  }, [local])

  const clearFilters = () => {
    router.push(pathname)
    setLocal({})
  }

  const renderInput = (filter: FilterConfig, value: string) => {
    switch (filter.type) {
      case 'select':
        return (
          <select
            value={value}
            onChange={e => handleChange(filter.key, e.target.value)}
            className={cn(control, filter.width || 'w-[140px]')}
          >
            <option value="">All</option>
            {filter.options?.map(opt => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        )

      case 'date':
        return (
          <input
            type="date"
            value={value}
            onChange={e => handleChange(filter.key, e.target.value)}
            className={cn(control, filter.width || 'w-[160px]')}
          />
        )

      case 'number':
        return (
          <input
            type="number"
            value={value}
            onChange={e => handleChange(filter.key, e.target.value)}
            className={cn(control, filter.width || 'w-[90px]')}
          />
        )

      default:
        return (
          <input
            type="text"
            placeholder={filter.placeholder}
            value={value}
            onChange={e => handleChange(filter.key, e.target.value)}
            className={cn(control, filter.width || 'w-[260px]')}
          />
        )
    }
  }

  return (
    <div className="mb-4 rounded-xl border border-gray-200 bg-white p-3 shadow-sm">
      <div className="flex flex-row flex-wrap items-end gap-3 justify-between">
        <div className="flex flex-1 flex-wrap items-end gap-3">
          {filters.map(filter => {
            const param = searchParams.get(filter.key)
            const value =
              filter.type === 'text'
                ? local[filter.key] ?? param ?? ''
                : param ?? String(filter.defaultValue ?? '')

            return (
              <div key={filter.key} className={cn("flex flex-col gap-1 grow", filter.type === 'text' ? 'min-w-[200px]' : 'min-w-[100px]', filter.className)}>
                <label className="text-[11px] font-bold uppercase tracking-wide text-slate-600">
                  {filter.label}
                </label>

                {renderInput(filter, value)}
              </div>
            )
          })}
        </div>

        <button
          onClick={clearFilters}
          className="h-9 px-4 rounded-lg border border-slate-300 bg-white text-sm font-bold text-slate-600 hover:bg-gray-50 transition-all hover:border-primary/50 uppercase tracking-widest text-[10px] shrink-0"
        >
          Clear Filters
        </button>
      </div>
    </div>
  )
}