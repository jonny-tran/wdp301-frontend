"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Box, Users, Settings, Package } from "lucide-react";
import { cn } from "@/lib/utils";

const routes = [
  { label: "Tổng quan", icon: LayoutDashboard, href: "/manager/dashboard" },
  { label: "Sản phẩm", icon: Package, href: "/manager/products" },
  { label: "Kho hàng", icon: Box, href: "/manager/inventory" },
  { label: "Nhân viên", icon: Users, href: "/manager/staff" },
  { label: "Cài đặt", icon: Settings, href: "/manager/settings" },
];

export function ManagerSidebar() {
  const pathname = usePathname();

  return (
    <div className="space-y-4 py-4 flex flex-col h-full bg-slate-50 dark:bg-slate-900 border-r">
      <div className="px-3 py-2 flex-1">
        <Link href="/manager/dashboard" className="flex items-center pl-3 mb-10">
          <h1 className="text-xl font-bold text-primary">Manager Panel</h1>
        </Link>
        <div className="space-y-1">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:bg-primary/10 rounded-lg transition",
                pathname === route.href ? "text-primary bg-primary/10" : "text-zinc-500"
              )}
            >
              <div className="flex items-center flex-1">
                <route.icon className={cn("h-5 w-5 mr-3", pathname === route.href ? "text-primary" : "text-zinc-500")} />
                {route.label}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}