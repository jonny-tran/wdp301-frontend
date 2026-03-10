"use client";

import {
    PlusIcon,
    ArchiveBoxIcon,
} from "@heroicons/react/24/outline";
import Can from "@/components/shared/Can";
import { P } from "@/lib/authz";
import { Resource } from "@/utils/constant";

/** View model for each inventory row — decoupled from API DTO */
export interface InventoryRowItem {
    productId: number;
    productName: string;
    sku: string;
    totalQuantity: number;
    unit: string;
    status: "normal" | "low-stock" | "out-of-stock";
    warehouseName?: string;
}

interface InventoryTableProps {
    items: InventoryRowItem[];
    isLoading: boolean;
    isError: boolean;
    onAdjust?: (item: InventoryRowItem) => void;
}

const STATUS_BADGE: Record<InventoryRowItem["status"], { idle: string; hover: string; label: string }> = {
    normal: {
        idle: "bg-green-100 text-green-700",
        hover: "group-hover:bg-green-600 group-hover:text-white",
        label: "Normal",
    },
    "low-stock": {
        idle: "bg-orange-100 text-orange-700",
        hover: "group-hover:bg-orange-600 group-hover:text-white",
        label: "Low Stock",
    },
    "out-of-stock": {
        idle: "bg-red-100 text-red-700",
        hover: "group-hover:bg-red-600 group-hover:text-white",
        label: "Out of Stock",
    },
};

/**
 * InventoryTable — Pure presentational component.
 * Receives data and callbacks via props. Does NOT call any API hooks.
 */
export default function InventoryTable({
    items,
    isLoading,
    isError,
    onAdjust,
}: InventoryTableProps) {
    // 1. Loading State
    if (isLoading) {
        return (
            <div className="p-32 text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-slate-950 mb-4" />
                <p className="font-black text-slate-300 italic uppercase text-[10px] tracking-widest">
                    Đang kiểm kê kho hàng...
                </p>
            </div>
        );
    }

    // 2. Error State
    if (isError) {
        return (
            <div className="p-32 text-center flex flex-col items-center gap-4 text-red-400 uppercase italic font-black text-[10px] tracking-[0.3em]">
                <ArchiveBoxIcon className="h-10 w-10 opacity-40" />
                Không thể tải dữ liệu kho hàng. Vui lòng thử lại.
            </div>
        );
    }

    // 3. Empty State
    if (items.length === 0) {
        return (
            <div className="p-32 text-center flex flex-col items-center gap-4 text-slate-200 uppercase italic font-black text-[10px] tracking-[0.3em]">
                <ArchiveBoxIcon className="h-10 w-10 opacity-20" />
                Không tìm thấy sản phẩm nào
            </div>
        );
    }

    return (
        <div className="w-full overflow-x-auto scrollbar-hide">
            <table className="w-full min-w-[900px] text-left text-sm border-separate border-spacing-0 table-fixed">
                <thead className="bg-slate-50/50 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                    <tr>
                        <th className="px-6 py-4 border-b border-slate-100 w-[30%]">
                            Sản phẩm / SKU
                        </th>
                        <th className="px-6 py-4 border-b border-slate-100 w-[20%]">
                            Kho quản lý
                        </th>
                        <th className="px-6 py-4 border-b border-slate-100 text-center w-[15%]">
                            Tồn kho
                        </th>
                        <th className="px-6 py-4 border-b border-slate-100 text-center w-[15%]">
                            Trạng thái
                        </th>
                        <th className="px-6 py-4 border-b border-slate-100 text-right w-[20%]">
                            Thao tác
                        </th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 bg-white">
                    {items.map((item, idx) => {
                        const badge = STATUS_BADGE[item.status];
                        return (
                            <tr
                                key={`${item.productId}-${idx}`}
                                className="group hover:bg-slate-950 transition-all duration-300"
                            >
                                {/* Cột Sản phẩm */}
                                <td className="px-6 py-5">
                                    <div className="flex flex-col gap-1">
                                        <span className="font-black text-slate-900 group-hover:text-white transition-colors uppercase italic text-sm tracking-tighter">
                                            {item.productName}
                                        </span>
                                        <span className="text-[9px] font-bold text-slate-400 group-hover:text-slate-500 uppercase tracking-widest leading-none">
                                            SKU: {item.sku}
                                        </span>
                                    </div>
                                </td>

                                {/* Cột Kho */}
                                <td className="px-6 py-5">
                                    <span className="text-[10px] font-black text-slate-500 group-hover:text-slate-400 uppercase tracking-wider">
                                        {item.warehouseName}
                                    </span>
                                </td>

                                {/* Cột Số lượng */}
                                <td className="px-6 py-5 text-center group-hover:text-white font-black italic text-xl tracking-tighter tabular-nums transition-colors">
                                    {item.totalQuantity}
                                    <span className="ml-1 text-[10px] not-italic opacity-40 font-bold uppercase">
                                        {item.unit}
                                    </span>
                                </td>

                                {/* Cột Trạng thái */}
                                <td className="px-6 py-5 text-center">
                                    <div className="flex justify-center">
                                        <span
                                            className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-tighter transition-all ${badge.idle} ${badge.hover}`}
                                        >
                                            {badge.label}
                                        </span>
                                    </div>
                                </td>

                                {/* Cột Hành động */}
                                <td className="px-6 py-5 text-right">
                                    <div className="flex justify-end gap-2">
                                        {onAdjust && (
                                            <Can I={P.PRODUCT_UPDATE} on={Resource.PRODUCT}>
                                                <button
                                                    onClick={() => onAdjust(item)}
                                                    className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-white hover:text-slate-950 transition-all shadow-lg active:scale-95"
                                                >
                                                    <PlusIcon className="h-3 w-3 stroke-[3px]" />
                                                    Adjust
                                                </button>
                                            </Can>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}
