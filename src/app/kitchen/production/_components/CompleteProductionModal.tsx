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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
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
        defaultValues: { actualQuantity: target || undefined, surplusNote: "" },
    });

    const actual = form.watch("actualQuantity");
    const shortfall = typeof actual === "number" && Number.isFinite(actual) && target > 0 && actual < target - 1e-9;
    const surplus = typeof actual === "number" && Number.isFinite(actual) && target > 0 && actual > target + 1e-9;

    // Computed wastage
    const wastageAmount = typeof actual === "number" && Number.isFinite(actual) && target > 0
        ? Math.max(0, target - actual)
        : 0;
    const wastagePercent = target > 0 && wastageAmount > 0
        ? Math.round((wastageAmount / target) * 1000) / 10
        : 0;
    const yieldPercent = typeof actual === "number" && Number.isFinite(actual) && target > 0
        ? Math.round((actual / target) * 1000) / 10
        : 100;

    useEffect(() => {
        if (open && order) {
            form.reset({
                actualQuantity: order.targetQuantity,
                surplusNote: "",
            });
        }
    }, [open, order, form]);

    useEffect(() => {
        if (!surplus) {
            form.setValue("surplusNote", "");
        }
    }, [surplus, form]);

    if (!order) return null;

    const handleConfirm = form.handleSubmit((values) => {
        onSubmit(order.id, {
            actualQuantity: values.actualQuantity,
            surplusNote: values.surplusNote?.trim() || undefined,
        });
    });

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md border-2 border-zinc-800 bg-white text-zinc-950 sm:max-w-md">
                <DialogHeader className="space-y-1 text-left">
                    <DialogTitle className="flex items-center gap-2 text-xl font-black tracking-tight">
                        <Factory className="size-6 text-amber-500" aria-hidden />
                        Hoàn tất sản xuất
                    </DialogTitle>
                    <DialogDescription asChild>
                        <p className="text-base text-zinc-700">
                            <span className="font-bold text-zinc-900">{order.productName}</span>
                            <span className="text-zinc-500"> · Kế hoạch </span>
                            <span className="font-black tabular-nums text-zinc-900">
                                {order.targetQuantity} {order.unit}
                            </span>
                        </p>
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={handleConfirm} className="space-y-5">
                        <FormField
                            control={form.control}
                            name="actualQuantity"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-sm font-bold text-zinc-800">
                                        Sản lượng thực tế (Actual Yield){" "}
                                        <span className="font-normal text-zinc-500">(mặc định = kế hoạch)</span>
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            step="any"
                                            min={0}
                                            className="h-14 border-2 border-zinc-800 bg-zinc-50 text-2xl font-black tabular-nums"
                                            {...field}
                                            onChange={(e) => field.onChange(e.target.value === "" ? "" : Number(e.target.value))}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Yield & Wastage Summary */}
                        <div className="grid grid-cols-2 gap-3">
                            <div className={`rounded-xl p-3 ${yieldPercent >= 95 ? "bg-green-50 border border-green-200" : yieldPercent >= 80 ? "bg-amber-50 border border-amber-200" : "bg-red-50 border border-red-200"}`}>
                                <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Hiệu suất (Yield)</p>
                                <p className={`mt-1 text-2xl font-black tabular-nums ${yieldPercent >= 95 ? "text-green-700" : yieldPercent >= 80 ? "text-amber-700" : "text-red-700"}`}>
                                    {yieldPercent}%
                                </p>
                            </div>
                            <div className={`rounded-xl p-3 ${wastageAmount > 0 ? "bg-red-50 border border-red-200" : "bg-green-50 border border-green-200"}`}>
                                <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Hao hụt (Wastage)</p>
                                <div className="mt-1 flex items-baseline gap-1.5">
                                    <p className={`text-2xl font-black tabular-nums ${wastageAmount > 0 ? "text-red-700" : "text-green-700"}`}>
                                        {Math.round(wastageAmount * 100) / 100}
                                    </p>
                                    {wastageAmount > 0 && (
                                        <span className="text-xs font-semibold text-red-500">
                                            ({wastagePercent}%)
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {shortfall && (
                            <div className="flex gap-2 rounded-lg border border-amber-500/50 bg-amber-50 p-3 text-sm text-amber-950">
                                <AlertTriangle className="mt-0.5 size-5 shrink-0" aria-hidden />
                                <div>
                                    <p className="font-semibold">Sản lượng thấp hơn kế hoạch</p>
                                    <p className="mt-0.5 text-xs text-amber-800">
                                        Thiếu <span className="font-bold">{Math.round(wastageAmount * 100) / 100} {order.unit}</span> so với BOM chuẩn.
                                    </p>
                                </div>
                            </div>
                        )}

                        {surplus && (
                            <FormField
                                control={form.control}
                                name="surplusNote"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-sm font-bold text-amber-900">
                                            Ghi chú sản lượng dư <span className="text-red-600">*</span>
                                        </FormLabel>
                                        <Select value={field.value || ""} onValueChange={field.onChange}>
                                            <FormControl>
                                                <SelectTrigger className="h-14 w-full border-2 border-zinc-800 bg-white text-base font-semibold">
                                                    <SelectValue placeholder="Chọn ghi chú dư..." />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent className="border-2 border-zinc-800">
                                                <SelectItem value="Output higher than plan due to process optimization" className="py-3 text-base">
                                                    Quy trình tối ưu nên sản lượng cao hơn kế hoạch
                                                </SelectItem>
                                                <SelectItem value="Raw material variation increased output" className="py-3 text-base">
                                                    Biến thiên nguyên liệu làm tăng sản lượng đầu ra
                                                </SelectItem>
                                                <SelectItem value="Manual adjustment after quality check" className="py-3 text-base">
                                                    Điều chỉnh thủ công sau kiểm tra chất lượng
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        )}

                        <DialogFooter className="flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                            <Button
                                type="button"
                                variant="outline"
                                className="h-12 w-full border-2 sm:w-auto"
                                onClick={() => onOpenChange(false)}
                                disabled={isSubmitting}
                            >
                                Hủy
                            </Button>
                            <Button
                                type="submit"
                                className="h-14 w-full border-2 border-amber-500 bg-zinc-900 text-base font-black text-white hover:bg-zinc-800 sm:min-w-[200px]"
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
