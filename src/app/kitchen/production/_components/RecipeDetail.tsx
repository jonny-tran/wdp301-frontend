"use client";

import { AlertCircle, ClipboardList, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { RecipeDetail as RecipeDetailType } from "@/types/production";

export type RecipeDetailProps = {
    detail: RecipeDetailType | null;
    isLoading: boolean;
    /** productId → tồn khả dụng (available) tại kho bếp */
    stockByProductId: Map<number, number>;
};

export default function RecipeDetail({ detail, isLoading, stockByProductId }: RecipeDetailProps) {
    if (isLoading) {
        return (
            <div className="flex min-h-[420px] flex-1 items-center justify-center gap-2 border-2 border-dashed border-zinc-300 bg-zinc-50">
                <Loader2 className="size-8 animate-spin text-zinc-600" />
                <span className="text-lg font-medium text-zinc-700">Đang tải định mức (BOM)…</span>
            </div>
        );
    }

    if (!detail) {
        return (
            <div className="flex min-h-[420px] flex-1 flex-col items-center justify-center gap-3 border-2 border-dashed border-zinc-300 bg-zinc-50 p-8 text-center">
                <ClipboardList className="size-12 text-zinc-400" />
                <p className="max-w-md text-zinc-600">Chọn một công thức bên trái để xem nguyên liệu và đối chiếu tồn kho.</p>
            </div>
        );
    }

    return (
        <div className="min-h-[420px] flex-1 space-y-4 border-2 border-zinc-800 bg-white p-4 shadow-sm">
            <div className="border-b-2 border-zinc-200 pb-3">
                <h3 className="text-xl font-black text-zinc-950">{detail.productName}</h3>
                <p className="mt-1 text-sm font-semibold text-zinc-600">
                    Đơn vị đầu ra: {detail.unit}
                    {detail.referenceOutput != null && detail.referenceOutput > 0 && (
                        <span className="ml-2">· Chuẩn tham chiếu: {detail.referenceOutput} {detail.unit}</span>
                    )}
                </p>
                {detail.description && <p className="mt-2 text-sm text-zinc-700">{detail.description}</p>}
            </div>

            <div className="overflow-x-auto rounded-lg border-2 border-zinc-800">
                <Table>
                    <TableHeader>
                        <TableRow className="border-b-2 border-zinc-800 bg-zinc-900 hover:bg-zinc-900">
                            <TableHead className="font-bold text-white">Nguyên liệu</TableHead>
                            <TableHead className="font-bold text-white">Định mức chuẩn</TableHead>
                            <TableHead className="font-bold text-white">Tồn khả dụng</TableHead>
                            <TableHead className="font-bold text-white">Đủ nguyên liệu?</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {detail.bom.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={4} className="py-10 text-center text-zinc-500">
                                    Chưa có dòng BOM từ API.
                                </TableCell>
                            </TableRow>
                        )}
                        {detail.bom.map((line) => {
                            const available = stockByProductId.get(line.ingredientProductId) ?? 0;
                            const ok = available >= line.standardQuantity - 1e-9;
                            return (
                                <TableRow key={`${line.ingredientProductId}-${line.ingredientName}`} className="text-base">
                                    <TableCell className="font-semibold text-zinc-950">{line.ingredientName}</TableCell>
                                    <TableCell className="tabular-nums">
                                        {line.standardQuantity} {line.unit}
                                    </TableCell>
                                    <TableCell className="tabular-nums font-medium text-zinc-800">{available}</TableCell>
                                    <TableCell>
                                        {ok ? (
                                            <Badge className="bg-emerald-600 text-white">Đủ</Badge>
                                        ) : (
                                            <Badge className="flex w-fit items-center gap-1 bg-red-600 text-white">
                                                <AlertCircle className="size-3.5" />
                                                Thiếu
                                            </Badge>
                                        )}
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </div>
            <p className="text-xs text-zinc-500">
                Tồn khả dụng lấy từ tổng quan kho bếp (available). Khi bấm Start, hệ thống tạm giữ FEFO theo lô.
            </p>
        </div>
    );
}
