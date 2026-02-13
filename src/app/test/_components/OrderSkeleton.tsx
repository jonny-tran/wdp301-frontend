import { Skeleton } from "@/components/ui/skeleton"

export default function OrderSkeleton() {
    return (
        <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg space-y-4">
            {/* Header Skeleton */}
            <div className="bg-gray-50 p-4 flex justify-between items-center rounded-t-lg">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-4 w-24" />
            </div>

            <div className="bg-white rounded-lg">
                <table className="min-w-full divide-y divide-gray-300">
                    <thead className="bg-gray-50">
                        <tr>
                            {[...Array(5)].map((_, i) => (
                                <th key={i} scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                    <Skeleton className="h-4 w-24" />
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                        {[...Array(5)].map((_, i) => (
                            <tr key={i}>
                                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                                    <Skeleton className="h-4 w-32" />
                                </td>
                                <td className="whitespace-nowrap px-3 py-4 text-sm">
                                    <Skeleton className="h-4 w-20" />
                                </td>
                                <td className="whitespace-nowrap px-3 py-4 text-sm">
                                    <Skeleton className="h-4 w-24 rounded-full" />
                                </td>
                                <td className="whitespace-nowrap px-3 py-4 text-sm">
                                    <Skeleton className="h-4 w-20" />
                                </td>
                                <td className="whitespace-nowrap px-3 py-4 text-sm">
                                    <Skeleton className="h-4 w-36" />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination Skeleton */}
            <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
                <Skeleton className="h-4 w-48" />
                <div className="flex gap-2">
                    <Skeleton className="h-8 w-8" />
                    <Skeleton className="h-8 w-8" />
                    <Skeleton className="h-8 w-8" />
                </div>
            </div>
        </div>
    )
}