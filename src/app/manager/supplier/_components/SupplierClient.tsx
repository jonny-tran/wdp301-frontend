"use client";

import { useState, useMemo } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useSupplier } from "@/hooks/useSupplier";
import { Supplier } from "@/types/supplier";
import SupplierTable from "./SupplierTable";
import SupplierFormModal from "./SupplierFormModal";
import { normalizeMeta } from "@/app/manager/_components/query";
import BaseFilter, { FilterConfig } from "@/components/layout/BaseFilter";
import { BasePagination } from "@/components/layout/BasePagination";
import Can from "@/components/shared/Can";
import { P } from "@/lib/authz";
import { Resource } from "@/utils/constant";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
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

const filterConfig: FilterConfig[] = [
  {
    key: "search",
    label: "Tìm kiếm",
    type: "text",
    placeholder: "Tên, SĐT hoặc người liên hệ...",
  },
  {
    key: "isActive",
    label: "Trạng thái",
    type: "select",
    options: [
      { label: "Đang cung ứng", value: "true" },
      { label: "Ngừng hợp tác", value: "false" },
    ],
    width: "w-[160px]",
  },
];

export default function SupplierClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // Parse URL params
  const page = Number(searchParams.get("page") || "1");
  const limit = Number(searchParams.get("limit") || "10");
  const search = searchParams.get("search") || "";
  const isActiveRaw = searchParams.get("isActive");
  const isActive = isActiveRaw === "true" ? true : isActiveRaw === "false" ? false : undefined;

  // Modal state
  const [modalSupplier, setModalSupplier] = useState<Supplier | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Supplier | null>(null);

  const { supplierList, deleteSupplier } = useSupplier();
  const { data: rawData, isLoading, isError } = supplierList({
    page,
    limit,
    sortOrder: "DESC",
    search,
    isActive,
  });

  const items: Supplier[] = useMemo(() => {
    const rData = (rawData as { data?: unknown })?.data || rawData;
    return Array.isArray(rData) ? rData : (rData as { items?: Supplier[] })?.items || [];
  }, [rawData]);

  const meta = useMemo(() => {
    const rData = (rawData as { data?: unknown })?.data || rawData;
    const rawMeta = Array.isArray(rData) ? undefined : (rData as { meta?: unknown })?.meta;
    return normalizeMeta(rawMeta, page, limit, items.length);
  }, [rawData, page, limit, items.length]);

  const handlePageChange = (nextPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(nextPage));
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleOpenCreate = () => {
    setModalSupplier(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (supplier: Supplier) => {
    setModalSupplier(supplier);
    setIsModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (deleteTarget) {
      deleteSupplier.mutate(String(deleteTarget.id));
      setDeleteTarget(null);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Nhà cung cấp
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            {isLoading ? "Đang tải..." : `${meta.totalItems} đối tác trong hệ thống`}
          </p>
        </div>

        <Can I={P.SUPPLIER_CREATE} on={Resource.SUPPLIER}>
          <Button onClick={handleOpenCreate} className="gap-2">
            <Plus className="h-4 w-4" />
            Thêm NCC
          </Button>
        </Can>
      </div>

      {/* Filter */}
      <BaseFilter filters={filterConfig} />

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {isError ? (
          <div className="p-16 text-center text-sm text-red-500">
            Không thể kết nối đến máy chủ. Vui lòng thử lại.
          </div>
        ) : (
          <SupplierTable
            items={items}
            isLoading={isLoading}
            onEdit={handleOpenEdit}
            onDelete={(supplier) => setDeleteTarget(supplier)}
          />
        )}

        {/* Pagination */}
        {!isLoading && meta.totalPages > 1 && (
          <div className="border-t border-slate-100 px-6 py-4 bg-slate-50/50">
            <BasePagination
              currentPage={meta.currentPage}
              totalPages={meta.totalPages}
              onPageChange={handlePageChange}
              totalItems={meta.totalItems}
              itemsPerPage={meta.itemsPerPage}
            />
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      <SupplierFormModal
        isOpen={isModalOpen}
        supplier={modalSupplier}
        onClose={() => setIsModalOpen(false)}
      />

      {/* Delete Confirmation */}
      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa nhà cung cấp</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa &quot;{deleteTarget?.name}&quot;?
              Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction variant="destructive" onClick={handleConfirmDelete}>
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
