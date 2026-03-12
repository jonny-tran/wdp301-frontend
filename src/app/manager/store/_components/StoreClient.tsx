"use client";

import { useMemo, useState } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useStore } from "@/hooks/useStore";
import { Store, StoreReliabilityAnalytics, StoreDemandPatternAnalytics } from "@/types/store";

// Components
import StoreTable from "./StoreTable";
import StoreModal from "./StoreModal";
import StoreReliability from "./StoreReliability";
import DemandPattern from "./DemandPattern";
import Can from "@/components/shared/Can";
import { P } from "@/lib/authz";
import { Resource } from "@/utils/constant";
import { normalizeMeta } from "@/app/manager/_components/query";
import BaseFilter, { FilterConfig } from "@/components/layout/BaseFilter";
import { BasePagination } from "@/components/layout/BasePagination";
import { Button } from "@/components/ui/button";
import { Plus, LineChart } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
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
    placeholder: "Tìm tên cửa hàng...",
  },
  {
    key: "isActive",
    label: "Trạng thái",
    type: "select",
    options: [
      { label: "Active", value: "true" },
      { label: "Inactive", value: "false" },
    ],
    width: "w-[140px]",
  },
  {
    key: "sortOrder",
    label: "Sắp xếp",
    type: "select",
    defaultValue: "DESC",
    options: [
      { label: "Mới nhất", value: "DESC" },
      { label: "Cũ nhất", value: "ASC" },
    ],
    width: "w-[140px]",
  },
];

export default function StoreClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // Parse URL params
  const page = Number(searchParams.get("page") || "1");
  const limit = Number(searchParams.get("limit") || "10");
  const search = searchParams.get("search") || "";
  const sortOrder = (searchParams.get("sortOrder") as "ASC" | "DESC") || "DESC";
  const isActiveRaw = searchParams.get("isActive");
  const isActive = isActiveRaw === "true" ? true : isActiveRaw === "false" ? false : undefined;

  // Modal state
  const [modal, setModal] = useState<{ isOpen: boolean; editingStore: Store | null }>({
    isOpen: false,
    editingStore: null,
  });
  const [deleteTarget, setDeleteTarget] = useState<Store | null>(null);
  const [isDemandOpen, setIsDemandOpen] = useState(false);
  const [demandProductId, setDemandProductId] = useState<number>(1);

  const {
    storeList,
    deleteStore,
    storeReliabilityAnalytics,
    storeDemandPatternAnalytics,
  } = useStore();

  const { data: listData, isLoading: isListLoading } = storeList({
    page,
    limit,
    search,
    isActive,
    sortOrder,
    sortBy: "createdAt",
  });

  const { data: reliabilityRaw } = storeReliabilityAnalytics();
  const { data: demandRaw, isLoading: isDemandLoading } =
    storeDemandPatternAnalytics({ productId: demandProductId });

  // Unwrap data directly
  const stores: Store[] = useMemo(() => {
    const rawData = (listData as { data?: unknown })?.data || listData;
    return Array.isArray(rawData) ? rawData : (rawData as { items?: Store[] })?.items || [];
  }, [listData]);

  const reliabilityStats: StoreReliabilityAnalytics = useMemo(
    () => (reliabilityRaw as StoreReliabilityAnalytics) ?? [],
    [reliabilityRaw],
  );
  const demandPattern: StoreDemandPatternAnalytics = useMemo(
    () => (demandRaw as StoreDemandPatternAnalytics) ?? [],
    [demandRaw],
  );
  const meta = useMemo(() => {
    const rawData = (listData as { data?: unknown })?.data || listData;
    const rawMeta = Array.isArray(rawData) ? undefined : (rawData as { meta?: unknown })?.meta;
    return normalizeMeta(rawMeta, page, limit, stores.length);
  }, [listData, page, limit, stores.length]);

  const handlePageChange = (nextPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(nextPage));
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleConfirmDelete = () => {
    if (deleteTarget) {
      deleteStore.mutate(deleteTarget.id);
      setDeleteTarget(null);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Quản lý cửa hàng
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            {isListLoading ? "Đang tải..." : `${meta.totalItems} chi nhánh trong mạng lưới`}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            className="gap-2 text-xs"
            onClick={() => setIsDemandOpen(true)}
          >
            <LineChart className="h-4 w-4" />
            Nhu cầu theo sản phẩm
          </Button>
          <Can I={P.STORE_CREATE} on={Resource.STORE}>
            <Button
              onClick={() => setModal({ isOpen: true, editingStore: null })}
              className="gap-2"
            >
              <Plus className="h-4 w-4" />
              Thêm Store
            </Button>
          </Can>
        </div>
      </div>

      {/* Analytics Section (giữ gọn cho list view, Demand Pattern tách sang chi tiết/drawer */}
      <div className="grid grid-cols-1 xl:grid-cols-1 gap-6">
        <StoreReliability stats={reliabilityStats} />
      </div>

      {/* Filter */}
      <BaseFilter filters={filterConfig} />

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <StoreTable
          items={stores}
          isLoading={isListLoading}
          onEdit={(s) => setModal({ isOpen: true, editingStore: s })}
          onDelete={(store) => setDeleteTarget(store)}
        />

        {/* Pagination */}
        {!isListLoading && meta.totalPages > 1 && (
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

      {/* Store Modal */}
      <StoreModal
        isOpen={modal.isOpen}
        editingStore={modal.editingStore}
        onClose={() => setModal({ isOpen: false, editingStore: null })}
      />

      {/* Delete Confirmation */}
      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa cửa hàng</AlertDialogTitle>
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

      {/* Demand Pattern Drawer (Dialog) */}
      <Dialog open={isDemandOpen} onOpenChange={(open) => setIsDemandOpen(open)}>
        <DialogContent className="max-w-3xl sm:max-w-4xl bg-slate-50 border-slate-200">
          <DialogHeader>
            <DialogTitle>Nhu cầu đặt hàng theo sản phẩm</DialogTitle>
            <DialogDescription>
              Phân tích pattern đặt hàng theo ngày trong tuần để tối ưu lịch sản xuất & phân bổ.
            </DialogDescription>
          </DialogHeader>

          <div className="max-h-[80vh] overflow-y-auto pt-2">
            <DemandPattern
              data={demandPattern}
              isLoading={isDemandLoading}
              onSearchId={(id: number) => setDemandProductId(id)}
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
