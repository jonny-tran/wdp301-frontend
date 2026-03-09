"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import {
  ArrowLeftOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
  UserGroupIcon,
  ClipboardDocumentCheckIcon,
  AdjustmentsHorizontalIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import { TruckIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

// Danh sách các đường dẫn dành riêng cho Admin
const adminLinks = [
  // { name: "Dashboard", href: "/admin", icon: ChartBarIcon },
  { name: "Người dùng", href: "/admin/auth", icon: UserGroupIcon },
  { name: "Quản lý Giao hàng", href: "/admin/shipment", icon: TruckIcon },
  {
    name: "Xử lý Khiếu nại",
    href: "/admin/claim",
    icon: ClipboardDocumentCheckIcon,
  },
  {
    name: "Cấu hình hệ thống",
    href: "/admin/config",
    icon: AdjustmentsHorizontalIcon,
  },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false); // State cho Modal cảnh báo
  const { logout } = useAuth();

  const handleConfirmLogout = () => {
    // Lấy refreshToken từ bộ nhớ để thực hiện đăng xuất an toàn
    const refreshToken =
      typeof window !== "undefined"
        ? localStorage.getItem("refreshToken")
        : null;

    // Gọi mutation logout để xóa session trên cả client và server
    logout.mutate({
      refreshToken: refreshToken || "",
    });
    setShowLogoutConfirm(false);
  };

  return (
    <div className="flex min-h-screen bg-white font-sans antialiased text-slate-900">
      {/* 1. MOBILE OVERLAY */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-slate-900/10 backdrop-blur-[2px] z-60 lg:hidden animate-in fade-in duration-300"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* 2. SIDEBAR ADMIN (Sử dụng tông màu Indigo đặc trưng) */}
      <aside
        className={`
          fixed inset-y-0 left-0 w-64 bg-white border-r border-slate-100 p-4 flex flex-col justify-between z-70
          transition-transform duration-300 ease-in-out
          ${isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        <div>
          <div className="px-4 py-6 flex justify-between items-center">
            <h2 className="text-xl font-black text-slate-950 uppercase italic tracking-tighter">
              Admin <span className="text-indigo-600">Portal</span>
            </h2>
            <Button
              onClick={() => setIsMobileOpen(false)}
              className="lg:hidden text-slate-400"
            >
              <XMarkIcon className="h-6 w-6" />
            </Button>
          </div>

          <nav className="space-y-1.5 mt-6">
            {adminLinks.map((link) => {
              const isActive =
                pathname === link.href || pathname.startsWith(`${link.href}/`);
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsMobileOpen(false)}
                  className={`
                    group flex items-center gap-3 px-4 py-3.5 rounded-2xl text-[11px] font-black transition-all duration-300
                    ${isActive ? "bg-indigo-600 text-white shadow-lg shadow-indigo-100" : "text-slate-400 hover:bg-slate-50 hover:text-indigo-600"}
                  `}
                >
                  <link.icon
                    className={`h-5 w-5 ${isActive ? "text-white" : "group-hover:text-indigo-600"}`}
                  />
                  <span className="uppercase tracking-[0.15em]">
                    {link.name}
                  </span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Nút đăng xuất mở Modal cảnh báo */}
        <div className="pt-6 border-t border-slate-50">
          <button
            onClick={() => setShowLogoutConfirm(true)}
            disabled={logout.isPending}
            className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl text-[10px] font-black text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all uppercase tracking-[0.2em] group disabled:opacity-50"
          >
            <ArrowLeftOnRectangleIcon className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
            {logout.isPending ? "Đang thoát..." : "Đăng xuất"}
          </button>
        </div>
      </aside>

      {/* 3. MAIN AREA */}
      <div className="flex-1 flex flex-col min-w-0 lg:ml-64">
        <header className="lg:hidden h-14 bg-white border-b border-slate-100 flex items-center px-6 justify-between sticky top-0 z-40">
          <span className="text-xs font-black uppercase italic text-indigo-600">
            Admin
          </span>
          <Button
            onClick={() => setIsMobileOpen(true)}
            className="p-2 text-slate-900 bg-slate-50 rounded-xl"
          >
            <Bars3Icon className="h-6 w-6" />
          </Button>
        </header>

        <main className="p-4 md:p-8 lg:p-10 w-full min-h-screen">
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-700 max-w-1600px mx-auto">
            {children}
          </div>
        </main>
      </div>

      {/* 4. MODAL CẢNH BÁO XÁC NHẬN ĐĂNG XUẤT */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-200 flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
          <div className="w-full max-w-sm bg-white rounded-[2.5rem] p-8 shadow-2xl border border-slate-100 animate-in zoom-in duration-300">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="h-16 w-16 bg-rose-50 rounded-3xl flex items-center justify-center text-rose-600 shadow-inner">
                <ExclamationTriangleIcon className="h-8 w-8 stroke-[2px]" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-black uppercase italic text-slate-900 tracking-tighter">
                  Xác nhận thoát?
                </h3>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed">
                  Phiên làm việc của Admin sẽ kết thúc ngay lập tức.
                </p>
              </div>
              <div className="flex flex-col w-full gap-2 pt-4">
                <button
                  onClick={handleConfirmLogout}
                  className="w-full py-4 bg-rose-600 text-white rounded-full text-[10px] font-black uppercase italic tracking-[0.2em] hover:bg-rose-700 transition-all shadow-lg active:scale-95"
                >
                  Xác nhận đăng xuất
                </button>
                <button
                  onClick={() => setShowLogoutConfirm(false)}
                  className="w-full py-4 bg-slate-50 text-slate-400 rounded-full text-[10px] font-black uppercase tracking-[0.2em] hover:bg-slate-100 transition-all"
                >
                  Hủy bỏ
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
