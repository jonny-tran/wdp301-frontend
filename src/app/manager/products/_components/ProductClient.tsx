"use client";

import { useMemo, useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useProduct } from "@/hooks/useProduct";
import {
  parseManagerListQuery,
  normalizeMeta,
  createPaginationSearchParams,
  type RawSearchParams,
} from "@/app/manager/_components/query";
import { Product } from "@/types/product";
import ProductTable from "./ProductTable";
import ProductCreateModal from "./ProductCreateModal";
import ProductEditModal from "./ProductEditModal";
import ProductFilter from "./ProductFilter";
import { BasePagination } from "@/components/layout/BasePagination";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function ProductClient({
  searchParams,
}: {
  searchParams: RawSearchParams;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParamsHook = useSearchParams();

  // Modal state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // URL-Driven State
  const parsedQuery = useMemo(
    () => parseManagerListQuery(searchParams, { page: 1, limit: 10, sortOrder: "DESC" }),
    [searchParams],
  );

  const { productList, deleteProduct, restoreProduct } = useProduct();

  // Parse isActive from URL string
  let isActiveBool: boolean | undefined = undefined;
  if (searchParams.isActive === "true") isActiveBool = true;
  else if (searchParams.isActive === "false") isActiveBool = false;

  const listQuery = productList({
    page: parsedQuery.page,
    limit: parsedQuery.limit,
    search: parsedQuery.search || "",
    isActive: isActiveBool,
    sortOrder: parsedQuery.sortOrder,
  });

  const handleViewDetail = (id: number) => {
    router.push(`/manager/products/${id}`);
  };

  // Unwrap items directly — no mapper needed, backend returns camelCase
  const items: Product[] = useMemo(() => {
    const rawData = (listQuery.data as { data?: unknown })?.data || listQuery.data;
    return Array.isArray(rawData) ? rawData : (rawData as { items?: Product[] })?.items || [];
  }, [listQuery.data]);

  const meta = useMemo(() => {
    const rawData = (listQuery.data as { data?: unknown })?.data || listQuery.data;
    const rawMeta = Array.isArray(rawData) ? undefined : (rawData as { meta?: unknown })?.meta;
    return normalizeMeta(rawMeta, parsedQuery.page, parsedQuery.limit, items.length);
  }, [listQuery.data, items.length, parsedQuery.page, parsedQuery.limit]);

  const handlePageChange = (nextPage: number) => {
    const query = createPaginationSearchParams(searchParamsHook, nextPage);
    router.push(`${pathname}?${query}`);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Danh mục sản phẩm
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            {meta.totalItems} sản phẩm trong hệ thống
          </p>
        </div>

        <Button onClick={() => setIsCreateModalOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Thêm sản phẩm
        </Button>
      </div>

      {/* Filter */}
      <ProductFilter currentLimit={parsedQuery.limit} />

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <ProductTable
          items={items}
          rowStart={(meta.currentPage - 1) * meta.itemsPerPage}
          isLoading={listQuery.isLoading}
          onEdit={(product) => setEditingProduct(product)}
          onDelete={(id) => deleteProduct.mutate(id)}
          onRestore={(id) => restoreProduct.mutate(id)}
          onViewDetail={(product) => handleViewDetail(product.id)}
        />

        {/* Pagination Footer */}
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

      {/* Modals */}
      <ProductCreateModal
        key={isCreateModalOpen ? "create-open" : "create-closed"}
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />

      <ProductEditModal
        key={editingProduct ? `edit-${editingProduct.id}` : "edit-closed"}
        product={editingProduct}
        isOpen={!!editingProduct}
        onClose={() => setEditingProduct(null)}
      />
    </div>
  );
}
