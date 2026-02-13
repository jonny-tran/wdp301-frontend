import { Suspense } from 'react'
import OrderList from './_components/OrderList'
import OrderSkeleton from './_components/OrderSkeleton'
import OrderFilters from './_components/OrderFilters'

type Props = {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function Page(props: Props) {
    const searchParams = await props.searchParams

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Order Pagination Test (Server Side)</h1>
            <p className="mb-6 text-gray-600">
                This page demonstrates server-side data fetching with Suspense and Pagination.
                The data is fetched in a Server Component using the API request directly.
            </p>

            <OrderFilters />
            <Suspense fallback={<OrderSkeleton />}>
                <OrderList searchParams={searchParams} />
            </Suspense>
        </div>
    )
}