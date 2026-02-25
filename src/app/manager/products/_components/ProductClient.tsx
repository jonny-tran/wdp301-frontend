"use client";

import { useMemo, useState, useCallback } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

// Hooks & Types
import { useProduct } from "@/hooks/useProduct";
import { QueryProduct } from "@/types/product";

// Helpers & Mappers
import { extractProductDetail, extractProductItems } from "./product.mapper";
import {
  RawSearchParams,
  createPaginationSearchParams,
} from "@/app/kitchen/_components/query";

// UI Components
import ProductTable from "./ProductTable";
import ProductEditModal from "./ProductEditModal";
import ProductCreateModal from "./ProductCreateModal";
import ProductBatchModal from "./ProductBatchModal"; // Modal hiển thị danh sách lô hàng
import { BasePagination } from "@/components/layout/BasePagination";
import BaseFilter, { FilterConfig } from "@/components/layout/BaseFilter";
import { toast } from "sonner";
import {
  PlusIcon,
  CubeIcon,
  MagnifyingGlassIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";

interface ProductClientProps {
  searchParams: RawSearchParams;
}

export default function ProductClient({ searchParams }: ProductClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParamsHook = useSearchParams();

  // --- 1. QUẢN LÝ TRẠNG THÁI MODALS ---
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState<any>(null);

  // Trạng thái cho việc xem danh sách Lô hàng của một sản phẩm
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [isBatchModalOpen, setIsBatchModalOpen] = useState(false);

  // --- 2. XỬ LÝ QUERY THEO SWAGGER (PHÒNG THỦ) ---
  const parsedQuery = useMemo(() => {
    return {
      page: Number(searchParams.page) || 1,
      limit: Number(searchParams.limit) || 10,
      sortBy: (searchParams.sortBy as string) || "createdAt",
      sortOrder: (searchParams.sortOrder as "ASC" | "DESC") || "DESC",
      // Param search khớp với Swagger (Tìm theo tên hoặc SKU)
      search: (searchParams.search as string) || undefined,
      // Ép kiểu string URL về boolean cho isActive
      isActive:
        searchParams.isActive === "true"
          ? true
          : searchParams.isActive === "false"
            ? false
            : undefined,
    };
  }, [searchParams]);

  const { productList, deleteProduct, restoreProduct } = useProduct();
  const productQuery = productList(parsedQuery as QueryProduct);

  // --- 3. MAPPING DỮ LIỆU ---
  const items = useMemo(
    () => extractProductItems(productQuery.data),
    [productQuery.data],
  );

  const meta = useMemo(() => {
    const m =
      (productQuery.data as any)?.data?.meta ||
      (productQuery.data as any)?.meta;
    return {
      currentPage: m?.currentPage ?? 1,
      totalPages: m?.totalPages ?? 1,
      totalItems: m?.totalItems ?? 0,
      itemsPerPage: m?.itemsPerPage ?? 10,
    };
  }, [productQuery.data]);

  // --- 4. CÁC HÀM XỬ LÝ SỰ KIỆN ---
  const updateNavigation = useCallback(
    (params: Record<string, any>) => {
      const newSearchParams = createPaginationSearchParams(
        searchParamsHook,
        params,
      );
      router.push(`${pathname}?${newSearchParams.toString()}`);
    },
    [pathname, router, searchParamsHook],
  );

  const handleOpenEdit = (product: any) => {
    setProductToEdit(product);
    setIsEditModalOpen(true);
  };

  const handleOpenBatches = (product: any) => {
    setSelectedProduct(product);
    setIsBatchModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm("Xác nhận ngừng hoạt động sản phẩm này?")) {
      try {
        await deleteProduct.mutateAsync(id);
        toast.success("Đã chuyển trạng thái sang INACTIVE");
      } catch (e) {
        console.error(e);
      }
    }
  };

  const handleRestore = async (id: number) => {
    try {
      await restoreProduct.mutateAsync(id);
      toast.success("Đã khôi phục sản phẩm!");
    } catch (e) {
      console.error(e);
    }
  };

  // --- 5. CẤU HÌNH BỘ LỌC (FILTER) ---
  const filters: FilterConfig[] = [
    {
      key: "search",
      label: "Tìm kiếm",
      type: "text",
      placeholder: "Nhập mã SKU hoặc tên...",
      defaultValue: searchParams.search ?? "",
    },
    {
      key: "isActive",
      label: "Trạng thái",
      type: "select",
      options: [
        { label: "Tất cả", value: "" },
        { label: "Đang hoạt động", value: "true" },
        { label: "Ngừng hoạt động", value: "false" },
      ],
      defaultValue: (searchParams.isActive as string) ?? "",
    },
  ];

  return (
    <div className="flex flex-col gap-10 pb-20 animate-in fade-in duration-700">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-1">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-slate-900 rounded-[1.2rem] shadow-xl">
              <CubeIcon className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">
              Quản lý Catalog
            </h1>
          </div>
          <div className="flex items-center gap-2 ml-1">
            <SparklesIcon className="h-3 w-3 text-blue-500 animate-pulse" />
            <p className="text-[10px] font-bold text-slate-400 tracking-[0.2em] uppercase">
              System Database • {meta.totalItems} Sản phẩm [cite: 2026-02-25]
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="group flex items-center gap-3 rounded-full bg-slate-900 px-10 py-5 text-xs font-black text-white hover:bg-black transition-all active:scale-95 shadow-2xl shadow-slate-200"
        >
          <PlusIcon className="h-4 w-4 stroke-[3px]" />
          THÊM SẢN PHẨM MỚI
        </button>
      </div>

      {/* Filter Section */}
      <div className="rounded-[2.5rem] bg-white p-2 shadow-sm border border-slate-100">
        <BaseFilter filters={filters} />
      </div>

      {/* Table Section */}
      <div className="rounded-[3rem] border border-slate-100 bg-white shadow-2xl overflow-hidden flex flex-col min-h-[600px]">
        <div className="border-b border-slate-50 px-10 py-4 bg-slate-50/30 flex items-center gap-2">
          <MagnifyingGlassIcon className="h-3.5 w-3.5 text-slate-400" />
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
            Kết quả:{" "}
            {searchParams.search
              ? `"${searchParams.search}"`
              : "Tất cả sản phẩm"}
          </span>
        </div>

        <div className="flex-1">
          <ProductTable
            items={items}
            isLoading={productQuery.isLoading}
            isError={productQuery.isError}
            onEdit={handleOpenEdit}
            onViewDetail={handleOpenBatches} // Kết nối nút EyeIcon với Modal Lô hàng
            onDelete={handleDelete}
            onRestore={handleRestore}
          />
        </div>

        {/* Pagination */}
        <div className="border-t border-slate-50 px-10 py-8 bg-white/50">
          <BasePagination
            currentPage={meta.currentPage}
            totalPages={meta.totalPages}
            totalItems={meta.totalItems}
            itemsPerPage={meta.itemsPerPage}
            onPageChange={(page) => updateNavigation({ page })}
          />
        </div>
      </div>

      {/* Modals System */}
      <ProductCreateModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />

      <ProductEditModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setProductToEdit(null);
        }}
        product={productToEdit}
      />

      {/* Modal hiển thị danh sách lô hàng của gà đang chọn */}
      <ProductBatchModal
        isOpen={isBatchModalOpen}
        onClose={() => {
          setIsBatchModalOpen(false);
          setSelectedProduct(null);
        }}
        product={selectedProduct}
      />
    </div>
  );
}
