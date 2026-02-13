'use client'

import { useOrder } from "@/hooks/useOrder";
import { Order } from "@/types/order";
import { Pagination } from "./Pagination";
import { OrderStatus } from "@/utils/enum";
import OrderSkeleton from "./OrderSkeleton";

interface OrderListProps {
    searchParams: { [key: string]: string | string[] | undefined }
}

export default function OrderList({ searchParams }: OrderListProps) {
    const page = Number(searchParams.page) || 1
    const limit = Number(searchParams.limit) || 10

    // Use the custom hook to fetch data
    const { orderList } = useOrder()

    // Construct query object from searchParams
    const { data: responseData, isLoading, isError, error } = orderList({
        page: page,
        limit: limit,
        sortOrder: (searchParams.sortOrder as 'ASC' | 'DESC') || 'DESC',
        status: searchParams.status as OrderStatus,
        search: searchParams.search as string,
        storeId: searchParams.storeId as string,
        fromDate: searchParams.fromDate as string,
        toDate: searchParams.toDate as string
    })

    if (isLoading) {
        return <OrderSkeleton />
    }

    if (isError) {
        return (
            <div className="p-4 text-red-500 bg-red-50 border border-red-200 rounded">
                Error fetching orders: {(error as any)?.message || 'Unknown error'}
            </div>
        )
    }

    const data = responseData || { items: [], meta: { totalItems: 0, totalPages: 0, currentPage: 1, itemsPerPage: 10 } }
    // IMPORTANT: Map API response structure to what the UI expects if mismatch occurs, 
    // BUT looking at types, `BaseResponePagination` has `items` and `meta`.
    // Wait, let's double check `BaseResponePagination` definition in `src/types/base.ts`.
    // It was modified by user in Step 99 to have `totalItems`, `itemCount`, `itemsPerPage`, `totalPages`, `currentPage`.
    // My previous code in Step 102 used `meta.totalItems`.
    // The API request hook `useOrder` returns `res.data`.

    const orders = data.items || []
    const meta = data.meta

    return (
        <div>
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg">
                <table className="min-w-full divide-y divide-gray-300">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">ID</th>
                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Store ID</th>
                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Status</th>
                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Total Amount</th>
                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Created At</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                        {orders.map((order: Order) => (
                            <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">{order.id}</td>
                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{order.storeId}</td>
                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${order.status === OrderStatus.COMPLETED ? 'bg-green-100 text-green-800' :
                                        order.status === OrderStatus.PENDING ? 'bg-yellow-100 text-yellow-800' :
                                            order.status === OrderStatus.REJECTED ? 'bg-red-100 text-red-800' :
                                                'bg-gray-100 text-gray-800'
                                        }`}>
                                        {order.status}
                                    </span>
                                </td>
                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{order.totalAmount}</td>
                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{new Date(order.createdAt).toLocaleString()}</td>
                            </tr>
                        ))}
                        {orders.length === 0 && (
                            <tr>
                                <td colSpan={5} className="px-6 py-10 text-center text-gray-500 italic">No orders found</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {meta && (
                <Pagination
                    totalPages={meta.totalPages}
                    currentPage={meta.currentPage || meta.currentPage}
                    totalItems={meta.totalItems || meta.totalItems}
                    itemsPerPage={meta.itemsPerPage || meta.itemsPerPage}
                />
            )}
        </div>
    )
}
