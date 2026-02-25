"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth"; // Sử dụng hook nguyên bản của bạn
import {
  ChartBarIcon,
  ArrowLeftOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
  UserGroupIcon,
  ShieldCheckIcon,
  BuildingOfficeIcon,
  ClipboardDocumentCheckIcon,
  AdjustmentsHorizontalIcon,
} from "@heroicons/react/24/outline";
import { TruckIcon } from "lucide-react";

// Danh sách menu riêng cho Admin
const adminLinks = [
  { name: "Dashboard", href: "/admin", icon: ChartBarIcon },
  { name: "Người dùng", href: "/admin/auth", icon: UserGroupIcon },
  { name: "Quản lý Giao hàng", href: "/admin/shipment", icon: TruckIcon },
  {
    name: "Xử lý Khiếu nại",
    href: "/admin/claim",
    icon: ClipboardDocumentCheckIcon,
  },
  {
    name: "Cấu hình hệ thống",
    href: "/admin/config", // Đường dẫn tới trang cấu hình
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
  const { logout } = useAuth(); // Lấy hàm logout từ hook của bạn

  const handleLogout = () => {
    // Gọi mutation logout từ hook useAuth
    const refreshToken = localStorage.getItem("refreshToken");
    if (refreshToken) {
      logout.mutate({ refreshToken });
    }
  };

  return (
    <div className="flex min-h-screen bg-white font-sans antialiased text-slate-900">
      {/* 1. MOBILE OVERLAY */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-slate-900/10 backdrop-blur-[2px] z-[60] lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* 2. SIDEBAR ADMIN (Sử dụng màu Indigo để phân biệt với Manager) */}
      <aside
        className={`
        fixed inset-y-0 left-0 w-56 bg-white border-r border-slate-100 p-3 flex flex-col justify-between z-[70]
        transition-transform duration-300 ease-in-out
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}
      >
        <div>
          <div className="px-3 py-5 flex justify-between items-center">
            <h2 className="text-base font-black text-slate-950 uppercase italic tracking-tighter">
              Admin <span className="text-indigo-600">Portal</span>
            </h2>
            <button
              onClick={() => setIsMobileOpen(false)}
              className="lg:hidden text-slate-400"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>

          <nav className="space-y-1 mt-4">
            {adminLinks.map((link) => {
              const isActive =
                pathname === link.href || pathname.startsWith(`${link.href}/`);
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsMobileOpen(false)}
                  className={`
                    group flex items-center gap-2.5 px-3 py-3 rounded-xl text-[11px] font-black transition-all duration-200
                    ${
                      isActive
                        ? "bg-indigo-600 text-white shadow-md scale-[1.02]"
                        : "text-slate-400 hover:bg-slate-50 hover:text-indigo-600"
                    }
                  `}
                >
                  <link.icon
                    className={`h-4 w-4 ${isActive ? "text-white" : "group-hover:text-indigo-600"}`}
                  />
                  <span className="uppercase tracking-widest">{link.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="pt-4 border-t border-slate-50">
          <button
            onClick={handleLogout}
            disabled={logout.isPending}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-lg text-[9px] font-black text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all uppercase tracking-[0.2em]"
          >
            <ArrowLeftOnRectangleIcon className="h-4 w-4" />
            {logout.isPending ? "Logging out..." : "Logout"}
          </button>
        </div>
      </aside>

      {/* 3. MAIN AREA */}
      <div className="flex-1 flex flex-col min-w-0 lg:ml-56">
        <header className="lg:hidden h-12 bg-white border-b border-slate-100 flex items-center px-4 justify-between sticky top-0 z-40">
          <span className="text-[10px] font-black uppercase italic text-indigo-600">
            Admin Management
          </span>
          <button
            onClick={() => setIsMobileOpen(true)}
            className="p-1 text-slate-900"
          >
            <Bars3Icon className="h-5 w-5" />
          </button>
        </header>

        <main className="p-2 md:p-4 lg:p-5 w-full">
          <div className="animate-in fade-in slide-in-from-left-1 duration-500">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
