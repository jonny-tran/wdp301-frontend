"use client";

import { useMemo, useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
<<<<<<< HEAD
import { useProduct } from "@/hooks/useProduct";
=======

import { useAuth } from "@/hooks/useAuth";
import { useProduct } from "@/hooks/useProduct";
import { Product, QueryProduct } from "@/types/product";
import { BaseResponsePagination } from "@/types/base";

// Helpers
>>>>>>> 0da73fcc42b54874fcaea53673fda727cc87773c
import {
  normalizeMeta,
  createPaginationSearchParams,
<<<<<<< HEAD
  RawSearchParams,
=======
  readValue,
>>>>>>> 0da73fcc42b54874fcaea53673fda727cc87773c
} from "@/app/kitchen/_components/query";
import { extractProducts } from "./product.mapper";
import ProductTable from "./ProductTable";
import ProductCreateModal from "./ProductCreateModal";
import ProductEditModal from "./ProductEditModal";
import { BasePagination } from "@/components/layout/BasePagination";
import BaseFilter, { FilterConfig } from "@/components/layout/BaseFilter";
<<<<<<< HEAD
import { PlusIcon, CubeIcon, SparklesIcon } from "@heroicons/react/24/outline";
import { ProductRow } from "./product.types";
=======
import { toast } from "sonner";
import {
  PlusIcon,
  CubeIcon,
  MagnifyingGlassIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";
import Can from "@/components/shared/Can";
import { P } from "@/lib/authz";
import { Resource } from "@/utils/constant";
>>>>>>> 0da73fcc42b54874fcaea53673fda727cc87773c

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

  // 2. Phân tích tham số phân trang & lọc
  const page = Number(searchParams.page) || 1;
  const limit = Number(searchParams.limit) || 10;
  const sortOrder = (searchParams.sortOrder as "ASC" | "DESC") || "DESC";

  const { productList, deleteProduct, restoreProduct } = useProduct();

<<<<<<< HEAD
  const listQuery = productList({
    page,
    limit,
    search: (searchParams.search as string) || "",
    isActive:
      searchParams.isActive === "true"
        ? true
        : searchParams.isActive === "false"
          ? false
          : undefined,
    sortOrder: sortOrder,
  });

  // 3. Logic Chuyển sang trang Chi tiết (Thay vì mở Modal)
  const handleViewDetail = (id: number) => {
    // Chuyển hướng đến URL động /manager/products/[id]
    router.push(`/manager/products/${id}`);
  };

  const items = useMemo(
    () => extractProducts(listQuery.data),
    [listQuery.data],
  );

  const meta = useMemo(() => {
    const responseData = listQuery.data as any;
    const rawMeta = responseData?.data?.meta || responseData?.meta;
    return normalizeMeta(rawMeta, page, limit, items.length);
  }, [listQuery.data, page, limit, items.length]);
=======
  const items: Product[] = useMemo(
    () => productQuery.data?.items || [],
    [productQuery.data],
  );

  const meta = useMemo(() => {
    return {
      currentPage: productQuery.data?.meta?.currentPage ?? 1,
      totalPages: productQuery.data?.meta?.totalPages ?? 1,
      totalItems: productQuery.data?.meta?.totalItems ?? 0,
      itemsPerPage: productQuery.data?.meta?.itemsPerPage ?? 10,
    };
  }, [productQuery.data]);
>>>>>>> 0da73fcc42b54874fcaea53673fda727cc87773c

  const rowStart = (meta.currentPage - 1) * meta.itemsPerPage;

  const handlePageChange = (nextPage: number) => {
    const query = createPaginationSearchParams(searchParamsHook, nextPage);
    router.push(`${pathname}?${query}`);
  };

<<<<<<< HEAD
  const filterConfig: FilterConfig[] = [
=======
  const handleOpenBatches = (product: any) => {
    setSelectedProduct(product);
    setIsBatchModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm("Xác nhận ngừng hoạt động sản phẩm này?")) {
      try {
        await deleteProduct.mutateAsync(id);
      } catch (e) {
        console.error(e);
      }
    }
  };

  const handleRestore = async (id: number) => {
    try {
      await restoreProduct.mutateAsync(id);
    } catch (e) {
      console.error(e);
    }
  };

  // --- 5. CẤU HÌNH BỘ LỌC (FILTER) ---
  const filters: FilterConfig[] = [
>>>>>>> 0da73fcc42b54874fcaea53673fda727cc87773c
    {
      key: "search",
      label: "Tìm kiếm",
      type: "text",
<<<<<<< HEAD
      placeholder: "Tên hoặc SKU...",
      className: "lg:col-span-2",
=======
      placeholder: "Nhập mã SKU hoặc tên...",
      defaultValue: readValue(searchParams.search) ?? "",
>>>>>>> 0da73fcc42b54874fcaea53673fda727cc87773c
    },
    {
      key: "isActive",
      label: "Trạng thái",
      type: "select",
      options: [
        { label: "Tất cả", value: "" },
        { label: "Hoạt động", value: "true" },
        { label: "Đã ẩn", value: "false" },
      ],
      className: "lg:col-span-1",
    },
    {
      key: "limit",
      label: "Số dòng",
      type: "select",
      defaultValue: String(limit),
      options: [
        { label: "10 dòng", value: "10" },
        { label: "20 dòng", value: "20" },
      ],
      className: "lg:col-span-1",
    },
  ];

  return (
    <div className="space-y-10 pb-20 animate-in fade-in duration-700">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-1">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-slate-900 rounded-[1.5rem] shadow-xl">
              <CubeIcon className="h-7 w-7 text-white" />
            </div>
            <h1 className="text-4xl font-black uppercase italic text-slate-900 tracking-tighter leading-none">
              Danh mục <span className="text-indigo-600">Sản phẩm</span>
            </h1>
          </div>
          <div className="flex items-center gap-2 mt-2 ml-1">
            <SparklesIcon className="h-4 w-4 text-blue-500 animate-pulse" />
            <p className="text-[10px] font-bold text-slate-400 tracking-[0.2em] uppercase">
              Hệ thống Quản lý Kho • {meta.totalItems} sản phẩm
            </p>
          </div>
        </div>

<<<<<<< HEAD
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="group flex items-center gap-4 rounded-full bg-slate-900 px-10 py-5 text-xs font-black text-white hover:bg-black transition-all active:scale-95 shadow-2xl border-b-4 border-slate-700"
        >
          <PlusIcon className="h-5 w-5 stroke-[3px]" />
          THÊM SẢN PHẨM MỚI
        </button>
=======
        <Can I={P.PRODUCT_CREATE} on={Resource.PRODUCT}>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="group flex items-center gap-3 rounded-full bg-slate-900 px-10 py-5 text-xs font-black text-white hover:bg-black transition-all active:scale-95 shadow-2xl shadow-slate-200"
          >
            <PlusIcon className="h-4 w-4 stroke-[3px]" />
            THÊM SẢN PHẨM MỚI
          </button>
        </Can>
>>>>>>> 0da73fcc42b54874fcaea53673fda727cc87773c
      </div>

      <BaseFilter filters={filterConfig} />

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
            onViewDetail={(product) => handleViewDetail(product.id)} // Gọi hàm chuyển trang
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

      {/* Modal Tạo mới - Reset bằng key khi mở/đóng */}
      <ProductCreateModal
        key={isCreateModalOpen ? "create-open" : "create-closed"}
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />

      {/* Modal Chỉnh sửa - Reset bằng key chứa ID sản phẩm để nạp dữ liệu chuẩn */}
      <ProductEditModal
        key={editingProduct ? `edit-${editingProduct.id}` : "edit-closed"}
        product={editingProduct}
        isOpen={!!editingProduct}
        onClose={() => setEditingProduct(null)}
      />
    </div>
  );
}
