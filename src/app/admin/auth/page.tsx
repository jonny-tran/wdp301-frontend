import { Suspense } from "react";
import { RawSearchParams } from "@/app/kitchen/_components/query";
import UserClient from "./_components/UserClient";

/**
 * Metadata cho trang quản lý nhân sự
 */
export const metadata = {
  title: "Quản lý nhân sự ",
  description: "Hệ thống quản lý tài khoản và phân quyền nhân viên",
};

export default async function UserManagementPage({
  searchParams,
}: {
  searchParams: Promise<RawSearchParams>;
}) {
  // Chờ searchParams được resolve theo chuẩn Next.js 15+
  const resolvedSearchParams = await searchParams;

  return (
    <Suspense
      fallback={
        <div className="p-40 text-center animate-pulse">
          <p className="font-black text-slate-200 italic uppercase text-[10px] tracking-[0.4em]">
            Đang khởi tạo môi trường nhân sự...
          </p>
        </div>
      }
    >
      <UserClient searchParams={resolvedSearchParams} />
    </Suspense>
  );
}
