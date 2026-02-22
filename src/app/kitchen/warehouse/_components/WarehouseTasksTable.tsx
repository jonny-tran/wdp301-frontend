import Link from "next/link";
import { PickingTaskRow } from "./warehouse.types";

interface WarehouseTasksTableProps {
    tasks: PickingTaskRow[];
    rowStart: number;
    isLoading: boolean;
    isError: boolean;
    isResetting: boolean;
    onReset: (orderId: string) => void;
}

export default function WarehouseTasksTable({
    tasks,
    rowStart,
    isLoading,
    isError,
    isResetting,
    onReset,
}: WarehouseTasksTableProps) {
    return (
        <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
                <thead className="bg-gray-50/70 text-xs uppercase tracking-wide text-text-muted">
                    <tr>
                        <th className="px-6 py-3">No.</th>
                        <th className="px-6 py-3">Store</th>
                        <th className="px-6 py-3">Delivery</th>
                        <th className="px-6 py-3 text-right">Items</th>
                        <th className="px-6 py-3 text-center">Status</th>
                        <th className="px-6 py-3 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {isLoading ? (
                        <tr>
                            <td className="px-6 py-8 text-sm text-text-muted" colSpan={6}>
                                Loading warehouse tasks...
                            </td>
                        </tr>
                    ) : isError ? (
                        <tr>
                            <td className="px-6 py-8 text-sm text-red-500" colSpan={6}>
                                Failed to load warehouse tasks.
                            </td>
                        </tr>
                    ) : tasks.length === 0 ? (
                        <tr>
                            <td className="px-6 py-8 text-sm text-text-muted" colSpan={6}>
                                No picking task found.
                            </td>
                        </tr>
                    ) : (
                        tasks.map((task, index) => (
                            <tr key={task.orderId} className="hover:bg-gray-50">
                                <td className="px-6 py-4 font-bold text-text-main">#{rowStart + index + 1}</td>
                                <td className="px-6 py-4 text-text-main">{task.storeName}</td>
                                <td className="px-6 py-4 text-text-muted">
                                    {task.deliveryDate ? String(task.deliveryDate).slice(0, 10) : "-"}
                                </td>
                                <td className="px-6 py-4 text-right font-semibold text-text-main">{task.totalItems}</td>
                                <td className="px-6 py-4 text-center">
                                    <span className="rounded-full bg-blue-100 px-2 py-1 text-[10px] font-bold uppercase text-blue-700">
                                        {String(task.status)}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center justify-end gap-2">
                                        <button
                                            onClick={() => onReset(task.orderId)}
                                            disabled={isResetting}
                                            className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-semibold text-text-main hover:border-primary/40 hover:text-primary disabled:opacity-50"
                                        >
                                            Reset
                                        </button>
                                        <Link
                                            href={`/kitchen/warehouse/${task.orderId}`}
                                            className="rounded-lg bg-text-main px-3 py-1.5 text-xs font-bold text-white hover:bg-black"
                                        >
                                            Open
                                        </Link>
                                    </div>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}
