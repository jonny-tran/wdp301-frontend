import Link from "next/link";
import { ArrowRightIcon } from "@heroicons/react/24/outline";

interface PickingQueueCardProps {
    isLoading: boolean;
    isError: boolean;
    tasks: Record<string, unknown>[];
}

export default function PickingQueueCard({
    isLoading,
    isError,
    tasks,
}: PickingQueueCardProps) {
    return (
        <div className="xl:col-span-3 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
                <h3 className="text-base font-bold text-text-main">Priority Picking Queue</h3>
                <Link href="/kitchen/warehouse" className="text-sm font-semibold text-primary hover:underline">
                    Open queue
                </Link>
            </div>

            {isLoading ? (
                <p className="text-sm text-text-muted">Loading picking tasks...</p>
            ) : isError ? (
                <p className="text-sm text-red-500">Failed to load picking tasks.</p>
            ) : tasks.length === 0 ? (
                <p className="text-sm text-text-muted">No pending task at the moment.</p>
            ) : (
                <div className="space-y-3">
                    {tasks.slice(0, 6).map((task, index) => {
                        const orderId = String(task.orderId ?? task.id ?? "");
                        const storeName = String(task.storeName ?? task.store_name ?? "Store");
                        const totalItems = Number(task.totalItems ?? task.itemCount ?? 0);

                        return (
                            <Link
                                key={orderId}
                                href={`/kitchen/warehouse/${orderId}`}
                                className="flex items-center justify-between rounded-2xl border border-gray-100 p-4 hover:border-primary/40 hover:bg-gray-50"
                            >
                                <div>
                                    <p className="text-sm font-bold text-text-main">Order #{index + 1}</p>
                                    <p className="text-xs text-text-muted">
                                        {storeName} · {totalItems} items
                                    </p>
                                </div>
                                <span className="inline-flex items-center gap-1 text-xs font-bold uppercase text-primary">
                                    Start
                                    <ArrowRightIcon className="h-3.5 w-3.5" />
                                </span>
                            </Link>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
