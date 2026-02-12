"use client";

import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useGetProducts } from "@/hooks/useProduct";
import { ProductTableActions } from "./product-table-actions";
import { ChevronLeft, ChevronRight, Plus, Loader2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function ProductList() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const limit = 10;

  // 1. Lấy data từ hook (React Query)
  const {
    data: response,
    isLoading,
    isPlaceholderData,
  } = useGetProducts(page, limit);

  // 2. Chặn loading ở đây để đảm bảo response tồn tại ở dưới
  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Đang tải dữ liệu sản phẩm...</span>
      </div>
    );
  }

  // 3. Truy cập dữ liệu theo đúng cấu trúc JSON: response.data.items
  // Sử dụng nullish coalescing (??) để đảm bảo luôn có mảng rỗng nếu lỗi
  const products = response?.items ?? [];
  const meta = response?.meta;

  // 4. Logic chuyển trang
  const handlePrev = () => setPage((p) => Math.max(1, p - 1));
  const handleNext = () => {
    if (meta && page < meta.totalPages) {
      setPage((p) => p + 1);
    }
  };

  return (
    <div className="space-y-4 p-6">
      {/* Header trang */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            Danh sách sản phẩm
          </h2>
          <p className="text-sm text-muted-foreground">
            Quản lý nguyên liệu và món ăn trong hệ thống bếp trung tâm.
          </p>
        </div>
        <Button onClick={() => router.push("/manager/products/create")}>
          <Plus className="mr-2 h-4 w-4" /> Thêm sản phẩm
        </Button>
      </div>

      {/* Bảng dữ liệu */}
      <div className="rounded-md border bg-white shadow-sm">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead className="w-[80px]">Ảnh</TableHead>
              <TableHead>Tên sản phẩm / SKU</TableHead>
              <TableHead>Đơn vị</TableHead>
              <TableHead>Hạn dùng</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead className="text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow
                key={product.id}
                onClick={() => router.push(`/manager/products/${product.id}`)}
                className="cursor-pointer hover:bg-slate-50 transition-colors group"
              >
                <TableCell>
                  <div className="relative h-12 w-12 overflow-hidden rounded-lg border">
                    <Image
                      src={product.imageUrl || "/placeholder.png"}
                      alt=""
                      fill
                      className="object-cover"
                    />
                  </div>
                </TableCell>

                <TableCell>
                  {/* Style tên sản phẩm đậm hơn khi hover vào hàng */}
                  <div className="font-semibold group-hover:text-primary transition-colors">
                    {product.name}
                  </div>
                  <div className="text-xs text-muted-foreground uppercase font-mono">
                    {product.sku}
                  </div>
                </TableCell>

                <TableCell>
                  <Badge variant="secondary" className="font-normal">
                    {product.baseUnitName}
                  </Badge>
                </TableCell>

                <TableCell className="text-sm text-slate-600">
                  {product.shelfLifeDays} ngày
                </TableCell>

                <TableCell>
                  <Badge variant={product.isActive ? "default" : "secondary"}>
                    {product.isActive ? "Đang kinh doanh" : "Ngừng kinh doanh"}
                  </Badge>
                </TableCell>

                <TableCell
                  className="text-right"
                  onClick={(e) => e.stopPropagation()}
                >
                  <ProductTableActions product={product} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Điều khiển phân trang */}
      <div className="flex items-center justify-between py-2">
        <div className="text-sm text-muted-foreground">
          Hiển thị <strong>{products.length}</strong> /{" "}
          <strong>{meta?.totalItems ?? 0}</strong> sản phẩm
        </div>

        <div className="flex items-center space-x-4">
          <span className="text-sm font-medium">
            Trang {page} / {meta?.totalPages || 1}
          </span>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrev}
              disabled={page === 1 || isPlaceholderData}
            >
              <ChevronLeft className="h-4 w-4 mr-1" /> Trước
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleNext}
              disabled={!meta || page >= meta.totalPages || isPlaceholderData}
            >
              Tiếp <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
