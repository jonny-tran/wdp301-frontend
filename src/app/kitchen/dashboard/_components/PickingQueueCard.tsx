import Link from "next/link";
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import { PickingTaskListItem } from "@/types/warehouse";

interface PickingQueueCardProps {
    isLoading: boolean;
    isError: boolean;
    tasks: PickingTaskListItem[];
}

export default function PickingQueueCard({
    isLoading,
    isError,
    tasks,
}: PickingQueueCardProps) {
    // Calculate overall picking progress
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(
        (t) => t.status?.toUpperCase() === "COMPLETED" || t.status?.toUpperCase() === "DELIVERED"
    ).length;
    const progressPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    return (
        <div className="xl:col-span-3 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
                <h3 className="text-base font-bold text-gray-800">Hàng đợi lấy hàng ưu tiên</h3>
                <Link href="/kitchen/warehouse" className="text-sm font-semibold text-primary hover:underline">
                    Mở hàng đợi →
                </Link>
            </div>

            {/* Progress Bar */}
            {totalTasks > 0 && (
                <div className="mb-4">
                    <div className="flex items-center justify-between text-xs text-text-muted mb-1.5">
                        <span>Tiến độ soạn hàng</span>
                        <span className="font-bold text-text-main">{completedTasks}/{totalTasks} đơn ({progressPercent}%)</span>
                    </div>
                    <div className="h-2.5 w-full rounded-full bg-gray-100 overflow-hidden">
                        <div
                            className={`h-full rounded-full transition-all duration-700 ease-out ${
                                progressPercent >= 100
                                    ? "bg-green-500"
                                    : progressPercent >= 60
                                        ? "bg-blue-500"
                                        : progressPercent >= 30
                                            ? "bg-amber-500"
                                            : "bg-red-400"
                            }`}
                            style={{ width: `${Math.min(progressPercent, 100)}%` }}
                        />
                    </div>
                </div>
            )}

            {isLoading ? (
                <div className="flex items-center gap-2 py-4">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                    <p className="text-sm text-gray-500">Đang tải tác vụ lấy hàng...</p>
                </div>
            ) : isError ? (
                <p className="text-sm text-red-500">Tải tác vụ lấy hàng thất bại.</p>
            ) : tasks.length === 0 ? (
                <div className="rounded-xl bg-gray-50 py-6 text-center">
                    <p className="text-sm text-gray-500">Hiện tại không có tác vụ nào.</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {tasks.slice(0, 6).map((task, index) => {
                        const orderId = task.orderId;
                        const storeName = task.storeName || "Store";
                        const totalItems = task.totalItems || 0;
                        const isCompleted = task.status?.toUpperCase() === "COMPLETED" || task.status?.toUpperCase() === "DELIVERED";

                        return (
                            <Link
                                key={task.id || orderId || index}
                                href={`/kitchen/warehouse/${orderId}`}
                                className={`flex items-center justify-between rounded-2xl border p-4 transition-all hover:shadow-sm ${
                                    isCompleted
                                        ? "border-green-200 bg-green-50/30"
                                        : "border-gray-100 hover:border-primary/40 hover:bg-gray-50"
                                }`}
                            >
                                <div>
                                    <div className="flex items-center gap-2">
                                        <p className="text-sm font-bold text-gray-800">Đơn hàng #{index + 1}</p>
                                        {isCompleted && (
                                            <span className="rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-bold text-green-700">
                                                ✓ Xong
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-xs text-gray-500">
                                        {storeName} · {totalItems} sản phẩm
                                    </p>
                                </div>
                                {!isCompleted && (
                                    <span className="inline-flex items-center gap-1 text-xs font-bold uppercase text-primary">
                                        Bắt đầu
                                        <ArrowRightIcon className="h-3.5 w-3.5" />
                                    </span>
                                )}
                            </Link>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
