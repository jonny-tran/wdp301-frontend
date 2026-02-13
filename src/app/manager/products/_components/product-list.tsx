"use client";

import React from "react";
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
import { useProduct } from "@/hooks/useProduct";
import { ProductTableActions } from "./product-table-actions";
import { Plus, Loader2 } from "lucide-react";
import Image from "next/image";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import BaseFilter, { FilterConfig } from "@/components/layout/BaseFilter";
import { BasePagination } from "@/components/layout/BasePagination";

interface ProductListProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

export default function ProductList({ searchParams }: ProductListProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParamsHook = useSearchParams();
  const page = Number(searchParams.page) || 1;
  const limit = Number(searchParams.limit) || 10;
  const search = searchParams.search as string | undefined;
  const isActive = searchParams.isActive === 'true' ? true : searchParams.isActive === 'false' ? false : undefined;

  // 1. Lấy data từ hook (React Query)
  const { productList } = useProduct();
  const {
    data: response,
    isLoading,
    isError,
  } = productList({
    page,
    limit,
    sortOrder: (searchParams.sortOrder as 'ASC' | 'DESC') || 'DESC',
    search,
    isActive
  });

  // 2. Chặn loading ở đây để đảm bảo response tồn tại ở dưới
  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Đang tải dữ liệu sản phẩm...</span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex h-64 items-center justify-center">
        <span className="ml-2">Đã có lỗi xảy ra khi tải dữ liệu sản phẩm.</span>
      </div>
    );
  }

  // 3. Truy cập dữ liệu theo đúng cấu trúc JSON: response.data.items
  // Sử dụng nullish coalescing (??) để đảm bảo luôn có mảng rỗng nếu lỗi
  const products = response?.items ?? [];
  const meta = response?.meta;

  // 4. Logic chuyển trang
  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParamsHook.toString());
    params.set("page", newPage.toString());
    router.push(`${pathname}?${params.toString()}`);
  };

  // Cấu hình bộ lọc
  const filterConfig: FilterConfig[] = [
    {
      key: 'search',
      label: 'Tìm kiếm',
      type: 'text',
      placeholder: 'Tên sản phẩm hoặc SKU...',
      className: 'md:col-span-2'
    },
    {
      key: 'isActive',
      label: 'Trạng thái',
      type: 'select',
      options: [
        { label: 'Đang kinh doanh', value: 'true' },
        { label: 'Ngừng kinh doanh', value: 'false' }
      ]
    }
  ];

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

      {/* Bộ lọc */}
      <BaseFilter filters={filterConfig} />

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
                    {product.baseUnit}
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
      {meta && (
        <BasePagination
          currentPage={meta.currentPage}
          totalPages={meta.totalPages}
          onPageChange={handlePageChange}
          totalItems={meta.totalItems}
          itemsPerPage={meta.itemsPerPage}
        />
      )}
    </div>
  );
}
