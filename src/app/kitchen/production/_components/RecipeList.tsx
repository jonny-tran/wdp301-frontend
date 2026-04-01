"use client";

import { BookOpen, Loader2, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import type { RecipeSummary } from "@/types/production";
import { cn } from "@/lib/utils";

export type RecipeListProps = {
    recipes: RecipeSummary[];
    isLoading: boolean;
    search: string;
    onSearchChange: (v: string) => void;
    selectedId: string | null;
    onSelect: (id: string) => void;
};

export default function RecipeList({
    recipes,
    isLoading,
    search,
    onSearchChange,
    selectedId,
    onSelect,
}: RecipeListProps) {
    return (
        <div className="flex min-h-[420px] flex-col gap-4 border-2 border-zinc-800 bg-white p-4 shadow-sm lg:w-[min(100%,380px)] lg:shrink-0">
            <div className="flex items-center gap-2 border-b-2 border-zinc-200 pb-3">
                <BookOpen className="size-6 text-amber-600" aria-hidden />
                <h2 className="text-lg font-black uppercase tracking-tight text-zinc-900">Recipe Book</h2>
            </div>
            <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 size-5 -translate-y-1/2 text-zinc-500" />
                <Input
                    value={search}
                    onChange={(e) => onSearchChange(e.target.value)}
                    placeholder="Tìm công thức / sản phẩm…"
                    className="h-12 border-2 border-zinc-800 pl-11 text-base"
                />
            </div>
            {isLoading ? (
                <div className="flex flex-1 items-center justify-center gap-2 py-12">
                    <Loader2 className="size-8 animate-spin text-zinc-600" />
                    <span className="font-medium text-zinc-600">Đang tải…</span>
                </div>
            ) : (
                <ul className="max-h-[480px] flex-1 space-y-2 overflow-y-auto pr-1">
                    {recipes.length === 0 && (
                        <li className="py-8 text-center text-zinc-500">Không có công thức khớp tìm kiếm.</li>
                    )}
                    {recipes.map((r) => (
                        <li key={r.id}>
                            <button
                                type="button"
                                onClick={() => onSelect(r.id)}
                                className={cn(
                                    "w-full rounded-lg border-2 px-4 py-3 text-left transition-colors",
                                    selectedId === r.id
                                        ? "border-amber-500 bg-amber-50"
                                        : "border-zinc-200 bg-zinc-50 hover:border-zinc-400 hover:bg-white",
                                )}
                            >
                                <span className="block font-bold text-zinc-950">{r.productName}</span>
                                <span className="mt-1 block text-sm font-medium text-zinc-600">
                                    Đơn vị: {r.unit}
                                    {r.sku ? ` · SKU ${r.sku}` : ""}
                                </span>
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
