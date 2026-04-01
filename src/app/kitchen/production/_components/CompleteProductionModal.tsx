"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { AlertTriangle, Factory } from "lucide-react";
import { useEffect, useMemo } from "react";
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
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { CompleteProductionBodyType } from "@/schemas/production";
import { createCompleteProductionFormSchema } from "@/schemas/production";
import type { ProductionOrder } from "@/types/production";

type CompleteProductionModalProps = {
    order: ProductionOrder | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (id: string, body: CompleteProductionBodyType) => void;
    isSubmitting: boolean;
};

export default function CompleteProductionModal({
    order,
    open,
    onOpenChange,
    onSubmit,
    isSubmitting,
}: CompleteProductionModalProps) {
    const target = order?.targetQuantity ?? 0;

    const schema = useMemo(() => createCompleteProductionFormSchema(target > 0 ? target : 1), [target]);

    const form = useForm<CompleteProductionBodyType>({
        resolver: zodResolver(schema) as import("react-hook-form").Resolver<CompleteProductionBodyType>,
        defaultValues: { actualQuantity: target || undefined, wasteReason: "" },
    });

    const actual = form.watch("actualQuantity");
    const efficiency =
        target > 0 && typeof actual === "number" && Number.isFinite(actual)
            ? Math.round((actual / target) * 1000) / 10
            : null;

    useEffect(() => {
        if (open && order) {
            form.reset({
                actualQuantity: order.targetQuantity,
                wasteReason: "",
            });
        }
    }, [open, order, form]);

    if (!order) return null;

    const handleConfirm = form.handleSubmit((values) => {
        onSubmit(order.id, {
            actualQuantity: values.actualQuantity,
            wasteReason: values.wasteReason?.trim() || undefined,
        });
    });

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-lg border-2 border-zinc-800 bg-zinc-50 text-zinc-950 sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-xl font-bold tracking-tight">
                        <Factory className="size-6 text-amber-500" aria-hidden />
                        Hoàn tất lệnh sản xuất
                    </DialogTitle>
                    <DialogDescription className="text-zinc-600">
                        {order.productName} — Mục tiêu{" "}
                        <span className="font-semibold text-zinc-900">
                            {order.targetQuantity} {order.unit}
                        </span>
                    </DialogDescription>
                </DialogHeader>

                <div
                    className="flex gap-3 rounded-lg border border-amber-600/40 bg-amber-950/10 p-4 text-sm text-zinc-800"
                    role="note"
                >
                    <AlertTriangle className="mt-0.5 size-5 shrink-0 text-amber-600" aria-hidden />
                    <p>
                        Xác nhận sẽ <strong>trừ nguyên liệu</strong> theo FEFO từ tồn kho, tạo{" "}
                        <strong>lô thành phẩm mới</strong> và ghi nhận hao hụt/dư nếu có chênh lệch so với mục tiêu.
                    </p>
                </div>

                <Form {...form}>
                    <form onSubmit={handleConfirm} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="actualQuantity"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-base font-semibold">Số lượng thực nhận</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            step="any"
                                            min={0}
                                            className="h-12 border-2 border-zinc-800 bg-white text-lg font-semibold"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {efficiency !== null && (
                            <div className="rounded-md border-2 border-zinc-800 bg-white px-4 py-3">
                                <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">
                                    Hiệu suất (Actual / Target)
                                </p>
                                <p className="text-3xl font-black tabular-nums text-zinc-900">{efficiency}%</p>
                            </div>
                        )}

                        <FormField
                            control={form.control}
                            name="wasteReason"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-base font-semibold">
                                        Lý do hao hụt / ghi chú{" "}
                                        <span className="font-normal text-zinc-500">(bắt buộc nếu thực tế &lt; mục tiêu)</span>
                                    </FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Ví dụ: Tràn, lỗi chất lượng, cân sai…"
                                            className="min-h-[100px] border-2 border-zinc-800 bg-white"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <DialogFooter className="gap-2 sm:gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                className="h-12 min-w-[120px] border-2"
                                onClick={() => onOpenChange(false)}
                                disabled={isSubmitting}
                            >
                                Hủy
                            </Button>
                            <Button
                                type="submit"
                                className="h-12 min-w-[160px] border-2 border-amber-500 bg-zinc-900 text-lg font-bold text-white hover:bg-zinc-800"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? "Đang xử lý…" : "Xác nhận hoàn tất"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
