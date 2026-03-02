"use client";

import { useMemo, useState, useCallback } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { authRequest } from "@/apiRequest/auth";
import { User, QueryUser } from "@/types/user";
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
  const [selectedUser, setSelectedUser] = useState<any>(null);

  const queryParams: any = useMemo(
    () => ({
      page: Number(readValue(searchParams.page)) || 1,
      limit: Number(readValue(searchParams.limit)) || 10,
      search: readValue(searchParams.search),
      role: readValue(searchParams.role),
      sortOrder: "DESC" as const,
    }),
    [searchParams],
  );

  // Fetch danh sách User
  const userQuery = useQuery({
    queryKey: ["users", queryParams],
    queryFn: () => authRequest.getUsers(queryParams).then((res: any) => res.data),
    placeholderData: (prev) => prev,
  });

  // Fetch danh sách Roles (để lấy label tiếng Việt)
  const rolesQuery = useQuery({
    queryKey: ["roles"],
    queryFn: () => authRequest.getRoles().then((res: any) => res.data),
  });

  // Mapping dữ liệu
  const items: User[] = useMemo(
    () => (userQuery.data as any)?.items || (userQuery.data as any)?.data?.items || [],
    [userQuery.data],
  );

  // Mapping roleOptions trực tiếp
  const roleOptions = useMemo(
    () => {
      const roles: any = (rolesQuery.data as any)?.data || rolesQuery.data || [];
      return Array.isArray(roles) ? roles.map((r: any) => ({
        value: r.value ?? r.id ?? "",
        label: r.label ?? r.name ?? "",
      })) : [];
    },
    [rolesQuery.data],
  );

  const meta = useMemo(() => {
    const m = (userQuery.data as any)?.meta || (userQuery.data as any)?.data?.meta;
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
        params,
      );
      router.push(`${pathname}?${newSearchParams.toString()}`);
    },
    [pathname, router, searchParamsHook],
  );

  const filters: FilterConfig[] = [
    {
      key: "search",
      label: "Tìm kiếm",
      type: "text",
      placeholder: "Tên hoặc email...",
      defaultValue: readValue(searchParams.search) ?? "",
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
      <div className="flex justify-between items-end px-1">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-600 rounded-2xl shadow-lg shadow-indigo-100">
              <UserGroupIcon className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-3xl font-black text-slate-900 uppercase italic tracking-tighter">
              Nhân sự hệ thống
            </h1>
          </div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-1">
            Tổng cộng: {meta.totalItems} tài khoản
          </p>
        </div>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center gap-2 rounded-full bg-slate-900 px-8 py-4 text-[11px] font-black text-white hover:bg-black transition-all shadow-xl"
        >
          <UserPlusIcon className="h-4 w-4 stroke-[3px]" /> THÊM NHÂN VIÊN
        </button>
      </div>

      <div className="rounded-[2.5rem] bg-white p-2 shadow-sm border border-slate-100">
        <BaseFilter filters={filters} />
      </div>

      <div className="rounded-[3rem] border border-slate-100 bg-white shadow-2xl overflow-hidden flex flex-col min-h-[600px]">
        <UserTable
          items={items}
          isLoading={userQuery.isLoading}
          roleOptions={roleOptions} // Truyền xuống để Table hiển thị được label
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

      <UserCreateModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
      <UserEditModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        user={selectedUser}
      />
    </div>
  );
}
