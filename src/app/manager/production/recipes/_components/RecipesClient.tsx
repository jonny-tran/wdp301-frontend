"use client";

import { useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useProduction } from "@/hooks/useProduction";
import {
    parseManagerListQuery,
    normalizeMeta,
    createPaginationSearchParams,
    type RawSearchParams,
} from "@/app/manager/_components/query";
import BaseFilter, { FilterConfig } from "@/components/layout/BaseFilter";
import { BasePagination } from "@/components/layout/BasePagination";
import { Button } from "@/components/ui/button";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Plus } from "lucide-react";
import type { RecipeSummary } from "@/types/production";
import RecipeTable from "./RecipeTable";
import RecipeFormModal from "./RecipeFormModal";
import RecipeDetailDialog from "./RecipeDetailDialog";

export default function RecipesClient({ searchParams }: { searchParams: RawSearchParams }) {
    const router = useRouter();
    const pathname = usePathname();
    const urlParams = useSearchParams();

    const parsed = useMemo(
        () => parseManagerListQuery(searchParams, { page: 1, limit: 10, sortOrder: "DESC" }),
        [searchParams],
    );

    const { productionRecipes, deleteRecipe } = useProduction();
    const listQuery = productionRecipes({
        page: parsed.page,
        limit: parsed.limit,
        sortOrder: parsed.sortOrder,
        search: parsed.search,
    });

    const items: RecipeSummary[] = listQuery.data?.items ?? [];
    const meta = useMemo(
        () => normalizeMeta(listQuery.data?.meta, parsed.page, parsed.limit, items.length),
        [listQuery.data?.meta, parsed.page, parsed.limit, items.length],
    );

    const [formOpen, setFormOpen] = useState(false);
    const [editingRecipeId, setEditingRecipeId] = useState<string | null>(null);
    const [detailRecipeId, setDetailRecipeId] = useState<string | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<RecipeSummary | null>(null);

    const filterConfig: FilterConfig[] = useMemo(
        () => [
            {
                key: "search",
                label: "Tìm theo thành phẩm",
                type: "text",
                placeholder: "Tên hoặc SKU đầu ra...",
                className: "lg:col-span-2",
            },
            {
                key: "limit",
                label: "Số dòng",
                type: "select",
                defaultValue: String(parsed.limit),
                options: [
                    { label: "10 dòng", value: "10" },
                    { label: "20 dòng", value: "20" },
                    { label: "50 dòng", value: "50" },
                ],
                className: "lg:col-span-1",
            },
        ],
        [parsed.limit],
    );

    const handlePageChange = (nextPage: number) => {
        const q = createPaginationSearchParams(urlParams, nextPage);
        router.push(`${pathname}?${q}`);
    };

    const openCreate = () => {
        setEditingRecipeId(null);
        setFormOpen(true);
    };

    const openEdit = (r: RecipeSummary) => {
        setEditingRecipeId(r.id);
        setFormOpen(true);
    };

    const closeForm = () => {
        setFormOpen(false);
        setEditingRecipeId(null);
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Công thức sản xuất (BOM)</h1>
                    <p className="text-sm text-slate-500 mt-1">
                        {meta.totalItems} công thức — định nghĩa định mức nguyên liệu cho thành phẩm
                    </p>
                </div>
                <Button className="gap-2" onClick={openCreate}>
                    <Plus className="h-4 w-4" />
                    Tạo công thức
                </Button>
            </div>

            <BaseFilter filters={filterConfig} />

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <RecipeTable
                    items={items}
                    isLoading={listQuery.isLoading}
                    rowStart={(meta.currentPage - 1) * meta.itemsPerPage}
                    onView={(r) => setDetailRecipeId(r.id)}
                    onEdit={openEdit}
                    onDelete={(r) => setDeleteTarget(r)}
                />
                <div className="border-t border-slate-100 px-6 py-4 bg-slate-50/50">
                    <BasePagination
                        currentPage={meta.currentPage}
                        totalPages={meta.totalPages}
                        onPageChange={handlePageChange}
                        totalItems={meta.totalItems}
                        itemsPerPage={meta.itemsPerPage}
                    />
                </div>
            </div>

            <RecipeFormModal open={formOpen} onClose={closeForm} recipeId={editingRecipeId} />

            <RecipeDetailDialog
                recipeId={detailRecipeId}
                open={!!detailRecipeId}
                onClose={() => setDetailRecipeId(null)}
            />

            <AlertDialog open={!!deleteTarget} onOpenChange={(o) => !o && setDeleteTarget(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Ngừng công thức?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Công thức &quot;{deleteTarget?.recipeName}&quot; sẽ được đánh dấu ngừng hoạt động (theo API
                            DELETE). Thao tác này thường không xóa hẳn dữ liệu lịch sử.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Hủy</AlertDialogCancel>
                        <AlertDialogAction
                            className="bg-red-600 hover:bg-red-700"
                            onClick={() => {
                                if (deleteTarget) {
                                    deleteRecipe.mutate(deleteTarget.id, {
                                        onSuccess: () => setDeleteTarget(null),
                                    });
                                }
                            }}
                        >
                            Xác nhận
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
