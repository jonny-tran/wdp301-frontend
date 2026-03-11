"use client";

import { authRequest } from "@/apiRequest/auth";
import { claimRequest } from "@/apiRequest/claim";
import http from "@/lib/http";
import { PaginationMeta } from "@/types/base";
import { Claim } from "@/types/claim";
import { User } from "@/types/user";
import { ENDPOINT_CLIENT } from "@/utils/endponit";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { SystemConfig } from "../config/_components/ConfigClient";
import DashboardSummary from "./DashboardSummary";
import RecentActivity from "./RecentActivity";

/** Shared response wrapper type */
interface PaginatedResponse<T> {
  items?: T[];
  meta?: PaginationMeta;
  data?: {
    items?: T[];
    meta?: PaginationMeta;
  };
}

export default function DashboardClient() {
  // 1. Total Users
  const usersQuery = useQuery({
    queryKey: ["dashboard-users-count"],
    queryFn: () =>
      authRequest
        .getUsers({ page: 1, limit: 1, sortOrder: "DESC" })
        .then((res) => res.data),
  });

  // 2. Total Stores
  const storesQuery = useQuery({
    queryKey: ["dashboard-stores-count"],
    queryFn: () =>
      http
        .get<PaginatedResponse<{ id: string }>>(ENDPOINT_CLIENT.STORES, {
          query: { page: 1, limit: 1 },
        })
        .then((res) => res.data),
  });

  // 3. Pending Claims
  const pendingClaimsQuery = useQuery({
    queryKey: ["dashboard-pending-claims"],
    queryFn: () =>
      claimRequest
        .getClaims({
          page: 1,
          limit: 5,
          sortOrder: "DESC",
          status: "pending" as never,
        })
        .then((res) => res.data),
  });

  // 4. System Configs
  const configsQuery = useQuery({
    queryKey: ["dashboard-configs"],
    queryFn: () =>
      http
        .get<SystemConfig[]>(ENDPOINT_CLIENT.SYSTEM_CONFIGS)
        .then((res) => (Array.isArray(res.data) ? res.data : [])),
  });

  // 5. Recent Users (for activity feed)
  const recentUsersQuery = useQuery({
    queryKey: ["dashboard-recent-users"],
    queryFn: () =>
      authRequest
        .getUsers({ page: 1, limit: 5, sortOrder: "DESC" })
        .then((res) => res.data),
  });

  // Extract metrics
  const totalUsers = useMemo(() => {
    const data = usersQuery.data as PaginatedResponse<User> | undefined;
    return data?.meta?.totalItems ?? data?.data?.meta?.totalItems ?? 0;
  }, [usersQuery.data]);

  const totalStores = useMemo(() => {
    const data = storesQuery.data as
      | PaginatedResponse<{ id: string }>
      | undefined;
    return data?.meta?.totalItems ?? data?.data?.meta?.totalItems ?? 0;
  }, [storesQuery.data]);

  const pendingClaimsCount = useMemo(() => {
    const data = pendingClaimsQuery.data as
      | PaginatedResponse<Claim>
      | undefined;
    return data?.meta?.totalItems ?? data?.data?.meta?.totalItems ?? 0;
  }, [pendingClaimsQuery.data]);

  const pendingClaims = useMemo(() => {
    const data = pendingClaimsQuery.data as
      | PaginatedResponse<Claim>
      | undefined;
    return data?.items ?? data?.data?.items ?? [];
  }, [pendingClaimsQuery.data]);

  const configs = configsQuery.data ?? [];

  const recentUsers = useMemo(() => {
    const data = recentUsersQuery.data as PaginatedResponse<User> | undefined;
    return data?.items ?? data?.data?.items ?? [];
  }, [recentUsersQuery.data]);

  // System health check
  const missingConfigs: string[] = [];
  const criticalKeys = ["ORDER_CLOSING_TIME", "FEFO_STRICT_MODE"];
  criticalKeys.forEach((key) => {
    if (!configs.find((c) => c.key === key)) {
      missingConfigs.push(key);
    }
  });

  const isLoading =
    usersQuery.isLoading ||
    storesQuery.isLoading ||
    pendingClaimsQuery.isLoading ||
    configsQuery.isLoading;

  return (
    <div className="flex flex-col gap-8 animate-in fade-in duration-500">
      {/* HEADER */}
      <div className="space-y-1 px-1">
        <h1 className="text-2xl font-bold text-slate-900">System Overview</h1>
        <p className="text-sm text-slate-400">
          Tổng quan hệ thống quản lý chuỗi cung ứng trung tâm
        </p>
      </div>

      {/* SUMMARY CARDS */}
      <DashboardSummary
        totalUsers={totalUsers}
        totalStores={totalStores}
        pendingClaimsCount={pendingClaimsCount}
        configCount={configs.length}
        isLoading={isLoading}
      />

      {/* SYSTEM NOTICE */}
      {missingConfigs.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 animate-in slide-in-from-top-2 duration-500">
          <div className="flex items-start gap-3">
            <div className="p-1.5 bg-amber-100 rounded-lg shrink-0 mt-0.5">
              <svg
                className="h-4 w-4 text-amber-600"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                />
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-bold text-amber-800">
                Cảnh báo cấu hình hệ thống
              </h3>
              <p className="text-xs text-amber-700 mt-1 leading-relaxed">
                Các tham số quan trọng sau chưa được cấu hình:{" "}
                {missingConfigs.map((key, i) => (
                  <span key={key}>
                    <code className="bg-amber-100 px-1.5 py-0.5 rounded text-[11px] font-bold">
                      {key}
                    </code>
                    {i < missingConfigs.length - 1 && ", "}
                  </span>
                ))}
                . Vui lòng vào{" "}
                <a
                  href="/admin/config"
                  className="text-amber-900 font-bold underline underline-offset-2"
                >
                  Cấu hình hệ thống
                </a>{" "}
                để thiết lập.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* BOTTOM GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* RECENT ACTIVITY */}
        <RecentActivity
          recentUsers={recentUsers}
          isLoading={recentUsersQuery.isLoading}
        />

        {/* PENDING CLAIMS PREVIEW */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-slate-900">
              Khiếu nại chờ xử lý
            </h2>
            <a
              href="/admin/claim"
              className="text-xs font-bold text-primary hover:underline"
            >
              Xem tất cả →
            </a>
          </div>

          {pendingClaims.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-slate-300">
              <svg
                className="h-8 w-8 mb-2"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="text-xs font-medium">Không có khiếu nại đang chờ</p>
            </div>
          ) : (
            <div className="space-y-2">
              {pendingClaims.slice(0, 5).map((claim, i) => (
                <div
                  key={claim.claimId ?? i}
                  className="flex items-center justify-between p-3 bg-slate-50 rounded-xl hover:bg-amber-50 transition-colors group"
                >
                  <div className="flex flex-col min-w-0">
                    <span
                      className="text-xs font-bold text-slate-700 font-mono truncate max-w-[200px]"
                      title={claim.shipmentId}
                    >
                      Ship: {claim.shipmentId?.slice(0, 12)}...
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {claim.createdAt
                        ? new Date(claim.createdAt).toLocaleDateString("vi-VN")
                        : "---"}
                    </span>
                  </div>
                  <span className="px-2.5 py-1 bg-amber-100 text-amber-700 text-[10px] font-bold rounded-lg">
                    Chờ duyệt
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
