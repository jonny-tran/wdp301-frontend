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
import { extractProducts } from "./product.mapper";
import ProductTable from "./ProductTable";
import ProductCreateModal from "./ProductCreateModal";
import ProductEditModal from "./ProductEditModal";
import ProductFilter from "./ProductFilter";
import { BasePagination } from "@/components/layout/BasePagination";
import { PlusIcon, CubeIcon, SparklesIcon } from "@heroicons/react/24/outline";
import { ProductRow } from "./product.types";

export default function ProductClient({
  searchParams,
}: {
  searchParams: RawSearchParams;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParamsHook = useSearchParams();

  // 1. Quản lý trạng thái Modal (Thêm & Sửa)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductRow | null>(null);

  // 2. URL-Driven State
  const parsedQuery = useMemo(
    () => parseManagerListQuery(searchParams, { page: 1, limit: 10, sortOrder: "DESC" }),
    [searchParams],
  );

  const { productList, deleteProduct, restoreProduct } = useProduct();

  // Bóc tách isActive từ chuỗi (vì ProductList Query expects boolean | undefined)
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

  // 3. Logic Chuyển sang trang Chi tiết Lô hàng
  const handleViewDetail = (id: number) => {
    router.push(`/manager/products/${id}`);
  };

  const items = useMemo(
    () => extractProducts(listQuery.data),
    [listQuery.data],
  );

  const meta = useMemo(() => {
    const rawMeta = listQuery.data?.meta;
    return normalizeMeta(rawMeta, parsedQuery.page, parsedQuery.limit, items.length);
  }, [listQuery.data, items.length, parsedQuery.page, parsedQuery.limit]);

  const rowStart = (meta.currentPage - 1) * meta.itemsPerPage;

  const handlePageChange = (nextPage: number) => {
    const query = createPaginationSearchParams(searchParamsHook, nextPage);
    router.push(`${pathname}?${query}`);
  };

  return (
    <div className="space-y-10 pb-20 animate-in fade-in duration-700">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-1">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-primary rounded-[1.5rem] shadow-xl">
              <CubeIcon className="h-7 w-7 text-white" />
            </div>
            <h1 className="text-4xl font-black font-display tracking-wider uppercase text-text-main leading-none">
              Danh mục <span className="text-primary">Sản phẩm</span>
            </h1>
          </div>
          <div className="flex items-center gap-2 mt-2 ml-1">
            <SparklesIcon className="h-4 w-4 text-primary animate-pulse" />
            <p className="text-[10px] font-bold text-slate-400 tracking-[0.2em] uppercase">
              Hệ thống Quản lý Kho • {meta.totalItems} sản phẩm
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="group flex items-center gap-4 rounded-full bg-primary px-10 py-5 text-xs font-black text-white hover:bg-primary-dark transition-all active:scale-95 shadow-2xl border-b-4 border-primary-dark"
        >
          <PlusIcon className="h-5 w-5 stroke-[3px]" />
          THÊM SẢN PHẨM MỚI
        </button>
      </div>

      <ProductFilter currentLimit={parsedQuery.limit} />

      {/* Bảng dữ liệu chính */}
      <div className="rounded-[3.5rem] border border-slate-100 bg-white shadow-2xl overflow-hidden flex flex-col min-h-[650px]">
        <div className="flex-1">
          <ProductTable
            items={items}
            rowStart={rowStart}
            isLoading={listQuery.isLoading}
            onEdit={(product) => setEditingProduct(product)}
            onDelete={(id) => deleteProduct.mutate(id)}
            onRestore={(id) => restoreProduct.mutate(id)}
            onViewDetail={(product) => handleViewDetail(product.id)}
          />
        </div>

        {/* Footer Phân trang */}
        <div className="border-t border-slate-50 px-12 py-10 bg-white/50 flex justify-between items-center">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">
            HIỂN THỊ {items.length} / {meta.totalItems} MẶT HÀNG
          </p>
          <BasePagination
            currentPage={meta.currentPage}
            totalPages={meta.totalPages}
            onPageChange={handlePageChange}
            totalItems={meta.totalItems}
            itemsPerPage={meta.itemsPerPage}
          />
        </div>
      </div>

      {/* MODALS QUẢN TRỊ */}

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
