'use client'

import BaseFilter, { FilterConfig } from '@/components/layout/BaseFilter'
import { OrderStatus } from '@/utils/enum'

export default function OrderFilters() {
    const filters: FilterConfig[] = [
        {
            key: 'search',
            label: 'Search',
            type: 'text',
            placeholder: 'Search orders...',
            className: 'col-span-1 md:col-span-2'
        },
        {
            key: 'status',
            label: 'Status',
            type: 'select',
            options: Object.values(OrderStatus).map(status => ({ label: status, value: status }))
        },
        {
            key: 'limit',
            label: 'Items per page',
            type: 'select',
            defaultValue: '10',
            options: [
                { label: '5', value: '5' },
                { label: '10', value: '10' },
                { label: '20', value: '20' },
                { label: '50', value: '50' }
            ]
        },
        {
            key: 'sortOrder',
            label: 'Sort Order',
            type: 'select',
            defaultValue: 'DESC',
            options: [
                { label: 'Newest First', value: 'DESC' },
                { label: 'Oldest First', value: 'ASC' }
            ]
        },
        {
            key: 'fromDate',
            label: 'From Date',
            type: 'date'
        },
        {
            key: 'toDate',
            label: 'To Date',
            type: 'date'
        }
    ]

    return <BaseFilter filters={filters} />
}
