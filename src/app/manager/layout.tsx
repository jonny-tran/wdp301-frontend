"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import {
  ArchiveBoxIcon,
  ChartBarIcon,
  ArrowLeftOnRectangleIcon,
  CubeIcon,
  Bars3Icon,
  XMarkIcon,
  UserGroupIcon,
  ClipboardDocumentListIcon,
  TruckIcon,
  InboxStackIcon,
  ShieldExclamationIcon,
  BuildingStorefrontIcon,
  ExclamationTriangleIcon, // Icon cho modal cảnh báo
} from "@heroicons/react/24/outline";
import { Button } from "@/components/ui/button";

// Danh sách Menu chuẩn cho Manager
const sidebarLinks = [
  // { name: "Dashboard", href: "/manager", icon: ChartBarIcon },
  { name: "Sản phẩm", href: "/manager/products", icon: CubeIcon },
  { name: "Lô hàng", href: "/manager/batch", icon: InboxStackIcon },
  { name: "Tồn kho", href: "/manager/inventory", icon: InboxStackIcon },
  { name: "Đơn hàng", href: "/manager/order", icon: ClipboardDocumentListIcon },
  { name: "Vận chuyển", href: "/manager/shipment", icon: TruckIcon },
  { name: "Đơn vị tính", href: "/manager/baseUnits", icon: ArchiveBoxIcon },
  { name: "Nhà cung cấp", href: "/manager/supplier", icon: UserGroupIcon },
  { name: "Khiếu nại", href: "/manager/claim", icon: ShieldExclamationIcon },
  { name: "Cửa hàng", href: "/manager/store", icon: BuildingStorefrontIcon },
];

export default function ManagerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false); // Quản lý modal cảnh báo
  const { logout } = useAuth();

  // Logic xác nhận đăng xuất an toàn
  const handleConfirmLogout = () => {
    const refreshToken =
      typeof window !== "undefined"
        ? localStorage.getItem("refreshToken")
        : null;
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
          className="fixed inset-0 bg-slate-900/10 backdrop-blur-[2px] z-[60] lg:hidden animate-in fade-in"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* 2. SIDEBAR - Black & White Minimalist (w-56) */}
      <aside
        className={`
        fixed inset-y-0 left-0 w-56 bg-white border-r border-slate-100 p-3 flex flex-col justify-between z-[70]
        transition-transform duration-300 ease-in-out
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}
      >
        <div>
          <div className="px-3 py-5 flex justify-between items-center">
            <h2 className="text-base font-black text-slate-950 uppercase italic tracking-tighter leading-none">
              Manager <span className="text-blue-600">Portal</span>
            </h2>
            <Button
              onClick={() => setIsMobileOpen(false)}
              className="lg:hidden text-slate-400 p-1"
            >
              <XMarkIcon className="h-5 w-5" />
            </Button>
          </div>

          <nav className="space-y-1 mt-4">
            {sidebarLinks.map((link) => {
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
                        ? "bg-slate-900 text-white shadow-md scale-[1.02]"
                        : "text-slate-400 hover:bg-slate-50 hover:text-slate-900"
                    }
                  `}
                >
                  <link.icon
                    className={`h-4 w-4 ${isActive ? "text-white" : "group-hover:text-slate-900"}`}
                  />
                  <span className="uppercase tracking-widest leading-none">
                    {link.name}
                  </span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Nút Logout mở cảnh báo */}
        <div className="pt-4 border-t border-slate-50">
          <button
            onClick={() => setShowLogoutConfirm(true)}
            disabled={logout.isPending}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-lg text-[9px] font-black text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all uppercase tracking-[0.2em] group disabled:opacity-50"
          >
            <ArrowLeftOnRectangleIcon className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
            {logout.isPending ? "Processing..." : "Đăng xuất"}
          </button>
        </div>
      </aside>

      {/* 3. MAIN AREA */}
      <div className="flex-1 flex flex-col min-w-0 lg:ml-56">
        <header className="lg:hidden h-12 bg-white border-b border-slate-100 flex items-center px-4 justify-between sticky top-0 z-40">
          <span className="text-[10px] font-black uppercase italic">
            Manager Console
          </span>
          <Button
            onClick={() => setIsMobileOpen(true)}
            className="p-1 text-slate-900"
          >
            <Bars3Icon className="h-5 w-5" />
          </Button>
        </header>

        <main className="p-2 md:p-4 lg:p-5 w-full min-h-screen">
          <div className="animate-in fade-in slide-in-from-left-1 duration-500 max-w-[1400px] mx-auto">
            {children}
          </div>
        </main>
      </div>

      {/* 4. MODAL CẢNH BÁO ĐĂNG XUẤT (FEFO Style) */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-300">
          <div className="w-full max-w-sm bg-white rounded-[2.5rem] p-8 shadow-2xl border border-slate-100 animate-in zoom-in">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="h-14 w-14 bg-red-50 rounded-2xl flex items-center justify-center text-red-600 shadow-inner">
                <ExclamationTriangleIcon className="h-7 w-7 stroke-[2px]" />
              </div>

              <div className="space-y-1">
                <h3 className="text-lg font-black uppercase italic text-slate-900 tracking-tighter leading-none">
                  Xác nhận thoát?
                </h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed mt-2">
                  Phiên làm việc của Manager sẽ kết thúc.
                </p>
              </div>

              <div className="flex flex-col w-full gap-2 pt-4">
                <button
                  onClick={handleConfirmLogout}
                  className="w-full py-4 bg-slate-900 text-white rounded-full text-[9px] font-black uppercase italic tracking-[0.2em] hover:bg-black transition-all shadow-lg"
                >
                  Xác nhận thoát
                </button>
                <button
                  onClick={() => setShowLogoutConfirm(false)}
                  className="w-full py-4 bg-slate-50 text-slate-400 rounded-full text-[9px] font-black uppercase tracking-[0.2em] hover:bg-slate-100 transition-all"
                >
                  Ở lại
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
