<<<<<<< HEAD
import { Suspense } from "react";
import { RawSearchParams } from "@/app/kitchen/_components/query";
import UserClient from "./_components/UserClient";

/**
 * Metadata cho trang quản lý nhân sự
 */
export const metadata = {
  title: "Quản lý nhân sự ",
  description: "Hệ thống quản lý tài khoản và phân quyền nhân viên",
=======
import { Metadata } from "next";
import { RawSearchParams } from "@/app/kitchen/_components/query";
import UserClient from "./_components/UserClient";

export const metadata: Metadata = {
  title: "User Management | VFC Admin",
  description: "Manage system users and their permissions.",
>>>>>>> 0da73fcc42b54874fcaea53673fda727cc87773c
};

export default async function UserManagementPage({
  searchParams,
}: {
  searchParams: Promise<RawSearchParams>;
}) {
  // Chờ searchParams được resolve theo chuẩn Next.js 15+
  const resolvedSearchParams = await searchParams;

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Sử dụng Suspense để bọc Client Component. 
        Trong lúc UserClient đang nạp dữ liệu hoặc hydrate, 
        fallback sẽ được hiển thị để tránh màn hình trắng.
      */}
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
    </div>
  );
}
