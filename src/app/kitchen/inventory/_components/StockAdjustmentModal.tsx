"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useInventory } from "@/hooks/useInventory";
import {
    KitchenStockAdjustFormSchema,
    type InventoryAdjustBodyType,
    type KitchenStockAdjustFormType,
} from "@/schemas/inventory";

interface StockAdjustmentModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    productId: number | null;
    productName: string;
    unit: string;
    /** batchId gợi ý khi mở từ dòng lô */
    initialBatchId?: number | null;
}

export default function StockAdjustmentModal({
    open,
    onOpenChange,
    productId,
    productName,
    unit,
    initialBatchId,
}: StockAdjustmentModalProps) {
    const { adjustInventory, kitchenDetails } = useInventory();
    const detailsQuery = kitchenDetails(productId ?? 0);
    const batches = detailsQuery.data?.batches ?? [];

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        reset,
        formState: { errors },
    } = useForm<KitchenStockAdjustFormType>({
        // zod v4 + @hookform/resolvers inference — ép kiểu giống manager InventoryAdjustModal
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        resolver: zodResolver(KitchenStockAdjustFormSchema) as any,
        defaultValues: {
            actualQuantity: 0,
            reasonCode: "DAMAGE",
            note: "",
        },
    });

    const batchId = watch("batchId");

    useEffect(() => {
        if (!open) return;
        const first = batches[0];
        const pick = initialBatchId != null ? batches.find((b) => b.batchId === initialBatchId) : undefined;
        const b = pick ?? first;
        if (b) {
            setValue("batchId", b.batchId);
            setValue("actualQuantity", Number(b.totalQuantity ?? 0));
        }
    }, [open, batches, initialBatchId, setValue]);

    useEffect(() => {
        if (!open) {
            reset({
                actualQuantity: 0,
                reasonCode: "DAMAGE",
                note: "",
            });
        }
    }, [open, reset]);

    const onSubmit = (data: KitchenStockAdjustFormType) => {
        const payload: InventoryAdjustBodyType = {
            batchId: data.batchId,
            actualQuantity: data.actualQuantity,
            reasonCode: data.reasonCode,
            note: data.note?.trim() ? data.note.trim() : undefined,
        };
        adjustInventory.mutate(payload, {
            onSuccess: () => {
                onOpenChange(false);
                reset();
            },
        });
    };

    const selectedBatch = batches.find((b) => b.batchId === batchId);

    const formDisabled = detailsQuery.isLoading || batches.length === 0;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md border-zinc-200 bg-white text-zinc-900" showCloseButton>
                <DialogHeader>
                    <DialogTitle>Điều chỉnh tồn kho</DialogTitle>
                    <DialogDescription>
                        {productName} · Đơn vị: {unit}
                        {productId ? ` · #${productId}` : ""}
                    </DialogDescription>
                </DialogHeader>

                {detailsQuery.isError && (
                    <p className="text-sm text-red-600">Không tải được danh sách lô. Thử lại sau.</p>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="batch">Lô hàng</Label>
                        <Select
                            disabled={formDisabled}
                            value={batchId ? String(batchId) : ""}
                            onValueChange={(v) => setValue("batchId", Number(v), { shouldValidate: true })}
                        >
                            <SelectTrigger id="batch" className="w-full">
                                <SelectValue placeholder={detailsQuery.isLoading ? "Đang tải lô…" : "Chọn lô"} />
                            </SelectTrigger>
                            <SelectContent>
                                {batches.map((b) => (
                                    <SelectItem key={b.batchId} value={String(b.batchId)}>
                                        {b.batchCode || b.batchId} — Vật lý {b.totalQuantity} {unit}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {errors.batchId && <p className="text-xs text-red-600">{errors.batchId.message}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="actualQuantity">Số lượng thực tế của lô</Label>
                        <Input
                            id="actualQuantity"
                            type="number"
                            min={0}
                            step="0.01"
                            {...register("actualQuantity", { valueAsNumber: true })}
                        />
                        {selectedBatch && (
                            <p className="text-[11px] text-zinc-500">
                                Hiện tại lô đang có: {selectedBatch.totalQuantity} {unit}
                            </p>
                        )}
                        {errors.actualQuantity && <p className="text-xs text-red-600">{errors.actualQuantity.message}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label>Lý do (bắt buộc)</Label>
                        <Select
                            value={watch("reasonCode")}
                            onValueChange={(v) =>
                                setValue("reasonCode", v as KitchenStockAdjustFormType["reasonCode"], { shouldValidate: true })
                            }
                        >
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="DAMAGE">Hư hỏng (DAMAGE)</SelectItem>
                                <SelectItem value="WASTE">Hao hụt / hủy (WASTE)</SelectItem>
                                <SelectItem value="PRODUCTION_WASTE">Hao hụt sản xuất (PRODUCTION_WASTE)</SelectItem>
                                <SelectItem value="INPUT_ERROR">Sai số nhập liệu (INPUT_ERROR)</SelectItem>
                                <SelectItem value="EXPIRED">Hết hạn (EXPIRED)</SelectItem>
                            </SelectContent>
                        </Select>
                        {errors.reasonCode && <p className="text-xs text-red-600">{errors.reasonCode.message}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="note">Ghi chú thêm</Label>
                        <Input id="note" placeholder="VD: Production Order #123" {...register("note")} />
                    </div>

                    <DialogFooter className="gap-2 sm:gap-0">
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Hủy
                        </Button>
                        <Button type="submit" disabled={adjustInventory.isPending || formDisabled}>
                            {adjustInventory.isPending ? "Đang gửi…" : "Xác nhận điều chỉnh"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
