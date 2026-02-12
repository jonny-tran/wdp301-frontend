"use client";

import { useParams, useRouter } from "next/navigation";
import { useGetProductDetail } from "@/hooks/useProduct";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowLeft, Edit, Package, Calendar, Info } from "lucide-react";
import Image from "next/image";
import { format } from "date-fns";

export default function ProductDetail() {
  const { id } = useParams();
  const router = useRouter();

  // 1. Lấy dữ liệu chi tiết sản phẩm từ Hook
  const { data: response, isLoading } = useGetProductDetail(id as string);
  const product = response?.data;

  if (isLoading)
    return (
      <div className="p-10 text-center animate-pulse">
        Đang tải chi tiết sản phẩm...
      </div>
    );
  if (!product)
    return (
      <div className="p-10 text-center text-destructive">
        Không tìm thấy thông tin sản phẩm.
      </div>
    );

  return (
    <div className="space-y-6">
      {/* Thanh tác vụ trên cùng */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Quay lại
        </Button>
        <Button onClick={() => router.push(`/manager/products/${id}/edit`)}>
          <Edit className="mr-2 h-4 w-4" /> Chỉnh sửa thông tin
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cột trái: Thông tin tổng quan */}
        <Card className="lg:col-span-1 shadow-sm">
          <CardHeader>
            <div className="relative aspect-square w-full overflow-hidden rounded-xl border bg-slate-50">
              <Image
                src={product.imageUrl || "/placeholder.png"}
                alt={product.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-2xl font-bold tracking-tight">
                  {product.name}
                </h1>
                <Badge variant={product.isActive ? "default" : "secondary"}>
                  {product.isActive ? "Đang bán" : "Ngừng bán"}
                </Badge>
              </div>
              <p className="text-sm font-mono text-blue-600 font-semibold">
                {product.sku}
              </p>
            </div>

            <Separator />

            <div className="grid grid-cols-2 gap-y-4 text-sm">
              <div className="flex flex-col gap-1">
                <span className="text-muted-foreground flex items-center gap-1">
                  <Package className="h-3 w-3" /> Đơn vị tính
                </span>
                <span className="font-medium">{product.baseUnitName}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-muted-foreground flex items-center gap-1">
                  <Calendar className="h-3 w-3" /> Hạn sử dụng
                </span>
                <span className="font-medium">
                  {product.shelfLifeDays} ngày
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-muted-foreground flex items-center gap-1">
                  <Info className="h-3 w-3" /> Ngày tạo
                </span>
                <span className="font-medium">
                  {format(new Date(product.createdAt), "dd/MM/yyyy")}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Cột phải: Danh sách lô hàng & Tồn kho */}
        <Card className="lg:col-span-2 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">
              Danh sách lô hàng trong kho
            </CardTitle>
            <Button size="sm" variant="outline">
              Nhập lô hàng mới
            </Button>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader className="bg-slate-50">
                  <TableRow>
                    <TableHead>Mã lô</TableHead>
                    <TableHead>Ngày hết hạn</TableHead>
                    <TableHead className="text-right">Số lượng tồn</TableHead>
                    <TableHead className="text-center">Trạng thái</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {/* Logic render Batches sẽ ở đây - Hiện tại dùng placeholder */}
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="h-32 text-center text-muted-foreground italic"
                    >
                      Chưa có dữ liệu lô hàng khả dụng cho sản phẩm này.
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
