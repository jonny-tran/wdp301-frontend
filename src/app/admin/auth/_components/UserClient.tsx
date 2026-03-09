"use client";

import { useMemo, useState, useCallback } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { authRequest } from "@/apiRequest/auth";
import { extractUserItems, extractRoleOptions } from "./user.mapper";
import {
  RawSearchParams,
  createPaginationSearchParams,
  readValue,
} from "@/app/kitchen/_components/query";
import UserTable from "./UserTable";
import UserCreateModal from "./UserCreateModal";
import UserEditModal from "./UserEditModal";
import { BasePagination } from "@/components/layout/BasePagination";
import BaseFilter, { FilterConfig } from "@/components/layout/BaseFilter";
import { UserGroupIcon, UserPlusIcon } from "@heroicons/react/24/outline";
import Can from "@/components/shared/Can";
import { P } from "@/lib/authz";
import { Resource } from "@/utils/constant";
import { UserRow, RoleOption } from "./user.types";

export default function UserClient({
  searchParams,
}: {
  searchParams: RawSearchParams;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParamsHook = useSearchParams();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserRow | null>(null);

  // 1. Chuẩn hóa Query Params
  const queryParams = useMemo(
    () => ({
      page: Number(readValue(searchParams.page)) || 1,
      limit: Number(readValue(searchParams.limit)) || 10,
      search: readValue(searchParams.search),
      role: readValue(searchParams.role),
      sortOrder: "DESC" as const,
    }),
    [searchParams],
  );

  // 2. Fetch dữ liệu
  const userQuery = useQuery({
    queryKey: ["users", queryParams],
    queryFn: () => authRequest.getUsers(queryParams).then((res) => res.data),
    placeholderData: (prev) => prev,
  });

  const rolesQuery = useQuery({
    queryKey: ["roles"],
    queryFn: () => authRequest.getRoles().then((res) => res.data),
  });

  // 3. Sử dụng Mapper để làm sạch dữ liệu (Loại bỏ logic mapping rườm rà)
  const items = useMemo(
    () => extractUserItems(userQuery.data),
    [userQuery.data],
  );

  const roleOptions = useMemo(
    () => extractRoleOptions(rolesQuery.data),
    [rolesQuery.data],
  );

  // 4. Bóc tách Metadata phân trang an toàn
  const meta = useMemo(() => {
    const rawData = userQuery.data as any;
    const m = rawData?.data?.meta || rawData?.meta;
    return {
      currentPage: m?.currentPage ?? 1,
      totalPages: m?.totalPages ?? 1,
      totalItems: m?.totalItems ?? 0,
      itemsPerPage: m?.itemsPerPage ?? 10,
    };
  }, [userQuery.data]);

  const updateNavigation = useCallback(
    (params: Record<string, any>) => {
      const newSearchParams = createPaginationSearchParams(
        searchParamsHook,
        params.page,
      );
      // Đảm bảo giữ lại các filter hiện tại khi chuyển trang
      if (queryParams.search) newSearchParams.set("search", queryParams.search);
      if (queryParams.role) newSearchParams.set("role", queryParams.role);

      router.push(`${pathname}?${newSearchParams.toString()}`);
    },
    [pathname, router, searchParamsHook, queryParams],
  );

  const filters: FilterConfig[] = [
    {
      key: "search",
      label: "Tìm kiếm",
      type: "text",
      placeholder: "Tên hoặc email...",
      defaultValue: (searchParams.search as string) ?? "",
    },
    {
      key: "role",
      label: "Vai trò",
      type: "select",
      options: [{ label: "Tất cả vai trò", value: "" }, ...roleOptions],
      defaultValue: readValue(searchParams.role) ?? "",
    },
  ];

  return (
    <div className="flex flex-col gap-8 pb-20 animate-in fade-in duration-500">
      {/* HEADER */}
      <div className="flex justify-between items-end px-1">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-600 rounded-2xl shadow-lg shadow-indigo-100">
              <UserGroupIcon className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-3xl font-black text-slate-900 uppercase italic tracking-tighter leading-none">
              Nhân sự <span className="text-indigo-600">Hệ thống</span>
            </h1>
          </div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-1">
            {meta.totalItems} tài khoản hoạt động
          </p>
        </div>
        <Can I={P.USER_CREATE} on={Resource.USER}>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-2 rounded-full bg-slate-900 px-8 py-4 text-[11px] font-black text-white hover:bg-indigo-600 transition-all shadow-xl active:scale-95 italic"
          >
            <UserPlusIcon className="h-4 w-4 stroke-[3px]" /> THÊM NHÂN VIÊN
          </button>
        </Can>
      </div>

      {/* FILTERS */}
      <div className="rounded-[2.5rem] bg-white p-2 shadow-sm border border-slate-100">
        <BaseFilter filters={filters} />
      </div>

      {/* TABLE */}
      <div className="rounded-[3rem] border border-slate-100 bg-white shadow-2xl overflow-hidden flex flex-col min-h-[600px]">
        <UserTable
          items={items}
          isLoading={userQuery.isLoading}
          roleOptions={roleOptions}
          onEdit={(user) => {
            setSelectedUser(user);
            setIsEditModalOpen(true);
          }}
        />
        <div className="mt-auto border-t border-slate-50 px-10 py-8">
          <BasePagination
            currentPage={meta.currentPage}
            totalPages={meta.totalPages}
            totalItems={meta.totalItems}
            itemsPerPage={meta.itemsPerPage}
            onPageChange={(page) => updateNavigation({ page })}
          />
        </div>
      </div>

      {/* MODALS */}
      <UserCreateModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
      <UserEditModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedUser(null);
        }}
        user={selectedUser}
        roleOptions={roleOptions}
      />
    </div>
  );
}
