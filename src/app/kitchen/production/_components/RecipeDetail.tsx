"use client";

import { AlertCircle, ClipboardList, Loader2, Play } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { RecipeDetail as RecipeDetailType } from "@/types/production";

export type RecipeDetailProps = {
    detail: RecipeDetailType | null;
    isLoading: boolean;
    /** productId → tồn khả dụng (available) tại kho bếp */
    stockByProductId: Map<number, number>;
    /** Tạo lệnh draft + POST start (FEFO); hoàn tất thực hiện ở tab Active Orders. */
    onStartProduction?: (payload: {
        productId: number;
        productName: string;
        plannedQuantity: number;
    }) => void | Promise<void>;
    isStarting?: boolean;
};

export default function RecipeDetail({
    detail,
    isLoading,
    stockByProductId,
    onStartProduction,
    isStarting = false,
}: RecipeDetailProps) {
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
        <RecipeDetailContent
            detail={detail}
            stockByProductId={stockByProductId}
            onStartProduction={onStartProduction}
            isStarting={isStarting}
        />
    );
}

function RecipeDetailContent({
    detail,
    stockByProductId,
    onStartProduction,
    isStarting,
}: {
    detail: RecipeDetailType;
    stockByProductId: Map<number, number>;
    onStartProduction?: RecipeDetailProps["onStartProduction"];
    isStarting: boolean;
}) {
    const [plannedQty, setPlannedQty] = useState(1);

    useEffect(() => {
        const def =
            detail.referenceOutput != null && detail.referenceOutput > 0 ? detail.referenceOutput : 1;
        setPlannedQty(def);
    }, [detail.id]);

    const planned = useMemo(() => {
        const n = Number(plannedQty);
        return Number.isFinite(n) && n > 0 ? n : 0;
    }, [plannedQty]);

    const bomOk =
        detail.bom.length > 0 &&
        planned > 0 &&
        detail.bom.every((line) => {
            const available = stockByProductId.get(line.ingredientProductId) ?? 0;
            const need = line.standardQuantity * planned;
            return available >= need - 1e-9;
        });

    const canStart = Boolean(onStartProduction && bomOk && !isStarting);

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

            {onStartProduction && (
                <div className="flex flex-wrap items-end gap-4 rounded-lg border-2 border-zinc-200 bg-zinc-50 p-4">
                    <div className="min-w-[200px] flex-1 space-y-2">
                        <Label htmlFor="recipe-planned-qty" className="text-sm font-bold text-zinc-800">
                            Số lượng kế hoạch (thành phẩm)
                        </Label>
                        <Input
                            id="recipe-planned-qty"
                            type="number"
                            min={0.001}
                            step="any"
                            value={plannedQty === 0 ? "" : plannedQty}
                            onChange={(e) => {
                                const v = e.target.value;
                                if (v === "") {
                                    setPlannedQty(0);
                                    return;
                                }
                                const n = Number(v);
                                setPlannedQty(Number.isFinite(n) ? n : 0);
                            }}
                            className="max-w-[220px] border-2 border-zinc-800 font-semibold tabular-nums"
                            aria-describedby="recipe-planned-hint"
                        />
                        <p id="recipe-planned-hint" className="text-xs text-zinc-500">
                            Định mức BOM × số lượng này = nhu cầu nguyên liệu (so với tồn khả dụng).
                        </p>
                    </div>
                    <Button
                        type="button"
                        size="lg"
                        disabled={!canStart}
                        className="min-h-[52px] gap-2 border-2 border-zinc-900 bg-amber-500 font-black text-zinc-950 hover:bg-amber-400 disabled:opacity-50"
                        onClick={() => {
                            if (!onStartProduction || planned <= 0) return;
                            void onStartProduction({
                                productId: detail.productId,
                                productName: detail.productName,
                                plannedQuantity: planned,
                            });
                        }}
                    >
                        {isStarting ? (
                            <Loader2 className="size-5 animate-spin" aria-hidden />
                        ) : (
                            <Play className="size-5" aria-hidden />
                        )}
                        Tạo lệnh &amp; Start (FEFO)
                    </Button>
                </div>
            )}

            <div className="overflow-x-auto rounded-lg border-2 border-zinc-800">
                <Table>
                    <TableHeader>
                        <TableRow className="border-b-2 border-zinc-800 bg-zinc-900 hover:bg-zinc-900">
                            <TableHead className="font-bold text-white">Nguyên liệu</TableHead>
                            <TableHead className="font-bold text-white">Định mức / 1 SP</TableHead>
                            <TableHead className="font-bold text-white">Cần cho mẻ</TableHead>
                            <TableHead className="font-bold text-white">Tồn khả dụng</TableHead>
                            <TableHead className="font-bold text-white">Đủ?</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {detail.bom.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={5} className="py-10 text-center text-zinc-500">
                                    Chưa có dòng BOM từ API.
                                </TableCell>
                            </TableRow>
                        )}
                        {detail.bom.map((line) => {
                            const available = stockByProductId.get(line.ingredientProductId) ?? 0;
                            const need = line.standardQuantity * planned;
                            const ok = planned > 0 && available >= need - 1e-9;
                            return (
                                <TableRow key={`${line.ingredientProductId}-${line.ingredientName}`} className="text-base">
                                    <TableCell className="font-semibold text-zinc-950">{line.ingredientName}</TableCell>
                                    <TableCell className="tabular-nums">
                                        {line.standardQuantity} {line.unit}
                                    </TableCell>
                                    <TableCell className="tabular-nums font-medium text-zinc-900">
                                        {planned > 0 ? (
                                            <>
                                                {Math.round(need * 1e6) / 1e6} {line.unit}
                                            </>
                                        ) : (
                                            "—"
                                        )}
                                    </TableCell>
                                    <TableCell className="tabular-nums font-medium text-zinc-800">{available}</TableCell>
                                    <TableCell>
                                        {planned <= 0 ? (
                                            <Badge variant="secondary">Nhập SL</Badge>
                                        ) : ok ? (
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
                Tồn khả dụng lấy từ tổng quan kho bếp (available). Nút Start gọi{" "}
                <code className="rounded bg-zinc-100 px-1">POST /production/orders</code> rồi{" "}
                <code className="rounded bg-zinc-100 px-1">POST .../start</code> (tạm giữ FEFO). Hoàn tất lệnh (ghi nhận
                thực tế) thực hiện ở tab <strong className="text-zinc-700">Active Orders</strong>.
            </p>
        </div>
    );
}
