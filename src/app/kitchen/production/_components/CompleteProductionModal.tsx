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
import { PRODUCTION_WASTE_PRESETS } from "@/schemas/production";
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
    const shortfall =
        typeof actual === "number" && Number.isFinite(actual) && target > 0 && actual < target - 1e-9;

    useEffect(() => {
        if (open && order) {
            form.reset({
                actualQuantity: order.targetQuantity,
                wasteReason: "",
            });
        }
    }, [open, order, form]);

    useEffect(() => {
        if (!shortfall) {
            form.setValue("wasteReason", "");
        }
    }, [shortfall, form]);

    if (!order) return null;

    const handleConfirm = form.handleSubmit((values) => {
        onSubmit(order.id, {
            actualQuantity: values.actualQuantity,
            wasteReason: values.wasteReason?.trim() || undefined,
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
                                        Thực tế làm được{" "}
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

                        {shortfall && (
                            <div className="flex gap-2 rounded-lg border border-amber-500/50 bg-amber-50 p-3 text-sm text-amber-950">
                                <AlertTriangle className="mt-0.5 size-5 shrink-0" aria-hidden />
                                <p>Thấp hơn kế hoạch — chọn lý do hao hụt.</p>
                            </div>
                        )}

                        {shortfall && (
                            <FormField
                                control={form.control}
                                name="wasteReason"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-sm font-bold text-amber-900">
                                            Lý do hao hụt <span className="text-red-600">*</span>
                                        </FormLabel>
                                        <Select value={field.value} onValueChange={field.onChange}>
                                            <FormControl>
                                                <SelectTrigger className="h-14 w-full border-2 border-zinc-800 bg-white text-base font-semibold">
                                                    <SelectValue placeholder="Chọn…" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent className="border-2 border-zinc-800">
                                                {PRODUCTION_WASTE_PRESETS.map((o) => (
                                                    <SelectItem key={o.value} value={o.value} className="py-3 text-base">
                                                        {o.label}
                                                    </SelectItem>
                                                ))}
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
