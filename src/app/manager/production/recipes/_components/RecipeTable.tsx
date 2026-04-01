"use client";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Eye, Pencil, Trash2, InboxIcon } from "lucide-react";
import type { RecipeSummary } from "@/types/production";

interface RecipeTableProps {
    items: RecipeSummary[];
    isLoading: boolean;
    rowStart: number;
    onView: (recipe: RecipeSummary) => void;
    onEdit: (recipe: RecipeSummary) => void;
    onDelete: (recipe: RecipeSummary) => void;
}

function TableSkeleton() {
    return (
        <>
            {Array.from({ length: 6 }).map((_, i) => (
                <TableRow key={i}>
                    <TableCell className="pl-6">
                        <Skeleton className="h-4 w-36" />
                    </TableCell>
                    <TableCell>
                        <Skeleton className="h-4 w-32" />
                    </TableCell>
                    <TableCell>
                        <Skeleton className="h-4 w-14" />
                    </TableCell>
                    <TableCell>
                        <Skeleton className="h-4 w-10" />
                    </TableCell>
                    <TableCell>
                        <Skeleton className="h-5 w-16" />
                    </TableCell>
                    <TableCell className="pr-6 text-right">
                        <Skeleton className="h-8 w-20 ml-auto" />
                    </TableCell>
                </TableRow>
            ))}
        </>
    );
}

function standardOutputLabel(r: RecipeSummary): string {
    if (r.referenceOutput != null && r.referenceOutput > 0) {
        return `${r.referenceOutput} ${r.unit}`.trim();
    }
    return `1 ${r.unit}`.trim();
}

export default function RecipeTable({
    items,
    isLoading,
    rowStart,
    onView,
    onEdit,
    onDelete,
}: RecipeTableProps) {
    if (!isLoading && items.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="rounded-full bg-slate-100 p-4 mb-4">
                    <InboxIcon className="h-8 w-8 text-slate-400" />
                </div>
                <p className="text-sm font-medium text-slate-500">Chưa có công thức</p>
                <p className="text-xs text-slate-400 mt-1">Thử đổi bộ lọc hoặc tạo BOM mới</p>
            </div>
        );
    }

    return (
        <Table>
            <TableHeader>
                <TableRow className="bg-slate-50/80 hover:bg-slate-50/80">
                    <TableHead className="pl-6 text-xs font-semibold text-slate-500 w-[52px]">#</TableHead>
                    <TableHead className="text-xs font-semibold text-slate-500">Tên công thức</TableHead>
                    <TableHead className="text-xs font-semibold text-slate-500">Thành phẩm</TableHead>
                    <TableHead className="text-xs font-semibold text-slate-500 w-[120px]">SL chuẩn</TableHead>
                    <TableHead className="text-xs font-semibold text-slate-500 w-[100px]">Số NL</TableHead>
                    <TableHead className="text-xs font-semibold text-slate-500 w-[88px]">Trạng thái</TableHead>
                    <TableHead className="text-right pr-6 text-xs font-semibold text-slate-500 w-[140px]">
                        Thao tác
                    </TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {isLoading ? (
                    <TableSkeleton />
                ) : (
                    items.map((r, index) => (
                        <TableRow key={r.id} className="hover:bg-slate-50/50">
                            <TableCell className="pl-6 text-sm text-slate-400 font-medium">
                                {rowStart + index + 1}
                            </TableCell>
                            <TableCell className="font-medium text-slate-900">{r.recipeName}</TableCell>
                            <TableCell>
                                <div>
                                    <p className="text-sm text-slate-900">{r.productName}</p>
                                    <p className="text-xs text-slate-400">{r.sku ?? "—"}</p>
                                </div>
                            </TableCell>
                            <TableCell className="text-sm text-slate-700">{standardOutputLabel(r)}</TableCell>
                            <TableCell className="text-sm tabular-nums text-slate-700">{r.ingredientCount}</TableCell>
                            <TableCell>
                                <Badge
                                    className={
                                        r.isActive
                                            ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                                            : "bg-slate-100 text-slate-600 border border-slate-200"
                                    }
                                >
                                    {r.isActive ? "Hoạt động" : "Ngừng"}
                                </Badge>
                            </TableCell>
                            <TableCell className="text-right pr-6">
                                <div className="flex justify-end gap-1">
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 text-slate-500 hover:text-blue-600"
                                        onClick={() => onView(r)}
                                    >
                                        <Eye className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 text-slate-500 hover:text-slate-800"
                                        onClick={() => onEdit(r)}
                                        disabled={!r.isActive}
                                        title={!r.isActive ? "Công thức đã ngừng — không sửa BOM" : undefined}
                                    >
                                        <Pencil className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 text-slate-500 hover:text-red-600"
                                        onClick={() => onDelete(r)}
                                        disabled={!r.isActive}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))
                )}
            </TableBody>
        </Table>
    );
}
