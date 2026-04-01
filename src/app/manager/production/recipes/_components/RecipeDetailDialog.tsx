"use client";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { useProduction } from "@/hooks/useProduction";

type Props = {
    recipeId: string | null;
    open: boolean;
    onClose: () => void;
};

export default function RecipeDetailDialog({ recipeId, open, onClose }: Props) {
    const { productionRecipeDetail } = useProduction();
    const q = productionRecipeDetail(recipeId, { enabled: open && !!recipeId });
    const d = q.data;

    return (
        <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
            <DialogContent className="sm:max-w-lg max-h-[85vh] flex flex-col">
                <DialogHeader>
                    <DialogTitle>Chi tiết công thức</DialogTitle>
                    <DialogDescription>
                        Định mức nguyên liệu trên 1 đơn vị thành phẩm đầu ra.
                    </DialogDescription>
                </DialogHeader>
                <div className="overflow-y-auto flex-1 space-y-4">
                    {q.isLoading ? (
                        <div className="space-y-2">
                            <Skeleton className="h-6 w-2/3" />
                            <Skeleton className="h-24 w-full" />
                        </div>
                    ) : d ? (
                        <>
                            <div className="rounded-lg border border-slate-200 bg-slate-50/80 p-3 text-sm space-y-1">
                                <p className="font-semibold text-slate-900">{d.recipeName}</p>
                                <p className="text-slate-600">
                                    Thành phẩm: <strong>{d.productName}</strong>
                                </p>
                                <p className="text-xs text-slate-500">
                                    SKU đầu ra: <span className="font-mono text-slate-700">{d.sku ?? "—"}</span>
                                </p>
                                <p className="text-xs text-slate-500">
                                    Đơn vị đầu ra (base unit):{" "}
                                    <strong className="text-slate-800">{d.unit}</strong>
                                </p>
                            </div>
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-slate-50/80">
                                        <TableHead className="text-xs">Nguyên liệu</TableHead>
                                        <TableHead className="text-xs w-[100px]">Định mức</TableHead>
                                        <TableHead className="text-xs w-[88px]">ĐVT (NL)</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {d.bom.map((line) => (
                                        <TableRow key={`${line.ingredientProductId}-${line.ingredientName}`}>
                                            <TableCell className="text-sm">
                                                {line.ingredientName}
                                                <span className="block text-xs text-slate-400">{line.sku ?? ""}</span>
                                            </TableCell>
                                            <TableCell className="text-sm tabular-nums">
                                                {line.standardQuantity}
                                            </TableCell>
                                            <TableCell className="text-sm text-slate-600">{line.unit}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </>
                    ) : (
                        <p className="text-sm text-slate-500">Không tải được chi tiết.</p>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
