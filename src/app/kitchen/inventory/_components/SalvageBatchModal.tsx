"use client";

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
import { useProduction } from "@/hooks/useProduction";
import { handleErrorApi } from "@/lib/errors";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

export type SalvageBatchModalProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    batchId: number;
    batchCode: string;
    productId: number;
    productName: string;
    maxConsume: number;
};

export default function SalvageBatchModal({
    open,
    onOpenChange,
    batchId,
    batchCode,
    productId,
    productName,
    maxConsume,
}: SalvageBatchModalProps) {
    const { productionRecipes, createSalvageOrder, completeSalvageOrder } = useProduction();
    const recipesQ = productionRecipes(
        { page: 1, limit: 200, sortOrder: "DESC", isActive: true },
        { enabled: open },
    );

    const [step, setStep] = useState<"create" | "complete">("create");
    const [salvageOrderId, setSalvageOrderId] = useState<string | null>(null);
    const [recipeId, setRecipeId] = useState<string>("");
    const [quantityToConsume, setQuantityToConsume] = useState<string>("");
    const [actualYield, setActualYield] = useState<string>("");
    const [surplusNote, setSurplusNote] = useState("");

    useEffect(() => {
        if (!open) {
            setStep("create");
            setSalvageOrderId(null);
            setRecipeId("");
            setQuantityToConsume("");
            setActualYield("");
            setSurplusNote("");
        }
    }, [open]);

    const recipeOptions = useMemo(() => recipesQ.data?.items ?? [], [recipesQ.data]);

    const submitCreate = async () => {
        const qty = Number(quantityToConsume);
        if (!Number.isFinite(qty) || qty <= 0) {
            toast.error("Nhập số lượng tiêu hao hợp lệ.");
            return;
        }
        if (qty > maxConsume) {
            toast.error(`Số lượng không vượt quá tồn khả dụng (${maxConsume}).`);
            return;
        }
        const res = await createSalvageOrder.mutateAsync({
            inputBatchId: batchId,
            recipeId,
            quantityToConsume: qty,
        });
        const oid = res.orderId;
        if (!oid) throw new Error("Không nhận được id lệnh salvage từ server.");
        setSalvageOrderId(oid);
        setStep("complete");
    };

    const submitComplete = async () => {
        if (!salvageOrderId) return;
        await completeSalvageOrder.mutateAsync({
            id: salvageOrderId,
            body: {
                actualYield: Number(actualYield),
                surplusNote: surplusNote.trim() || undefined,
            },
        });
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>Salvage — tận dụng lô sắp hết hạn</DialogTitle>
                    <DialogDescription>
                        Lô <span className="font-mono font-semibold">{batchCode}</span> — {productName} (NL #{productId}). Chọn công thức thành phẩm
                        và số lượng nguyên liệu tiêu hao, sau đó hoàn tất với sản lượng thực tế.
                    </DialogDescription>
                </DialogHeader>

                {step === "create" && (
                    <div className="grid gap-4 py-2">
                        <div className="grid gap-2">
                            <Label>Công thức (thành phẩm)</Label>
                            <Select value={recipeId} onValueChange={setRecipeId} disabled={recipesQ.isLoading}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Chọn recipe" />
                                </SelectTrigger>
                                <SelectContent>
                                    {recipeOptions.map((r) => (
                                        <SelectItem key={r.id} value={r.id}>
                                            {r.recipeName || r.productName}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid gap-2">
                            <Label>Số lượng nguyên liệu tiêu hao (tối đa {maxConsume})</Label>
                            <Input
                                type="number"
                                min={0.01}
                                step="any"
                                value={quantityToConsume}
                                onChange={(e) => setQuantityToConsume(e.target.value)}
                            />
                        </div>
                    </div>
                )}

                {step === "complete" && (
                    <div className="grid gap-4 py-2">
                        <p className="text-sm text-zinc-600">
                            Lệnh salvage: <span className="font-mono font-semibold">{salvageOrderId}</span>. Nhập sản lượng thực tế (thành phẩm).
                        </p>
                        <div className="grid gap-2">
                            <Label>Sản lượng thực tế (actualYield)</Label>
                            <Input
                                type="number"
                                min={0.01}
                                step="any"
                                value={actualYield}
                                onChange={(e) => setActualYield(e.target.value)}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label>Ghi chú dư thừa (tuỳ chọn)</Label>
                            <Input value={surplusNote} onChange={(e) => setSurplusNote(e.target.value)} />
                        </div>
                    </div>
                )}

                <DialogFooter className="gap-2 sm:gap-0">
                    <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                        Đóng
                    </Button>
                    {step === "create" && (
                        <Button
                            type="button"
                            disabled={createSalvageOrder.isPending || !recipeId}
                            onClick={() =>
                                void submitCreate().catch((e) => {
                                    handleErrorApi({ error: e });
                                })
                            }
                        >
                            {createSalvageOrder.isPending ? "Đang tạo…" : "Tạo lệnh salvage"}
                        </Button>
                    )}
                    {step === "complete" && (
                        <Button
                            type="button"
                            disabled={completeSalvageOrder.isPending}
                            onClick={() =>
                                void submitComplete().catch((e) => {
                                    handleErrorApi({ error: e });
                                })
                            }
                        >
                            {completeSalvageOrder.isPending ? "Đang hoàn tất…" : "Hoàn tất salvage"}
                        </Button>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
