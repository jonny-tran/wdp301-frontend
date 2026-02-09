"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { MOCK_PRODUCTS } from "@/constants/mock-data";
import { Product } from "@/schemas/product";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, Pencil, ImageIcon, Calendar, Package, Tag } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function ProductDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<(Product & { id: string }) | null>(null);

  useEffect(() => {
    const data = MOCK_PRODUCTS.find((p) => p.id === id);
    if (data) setProduct(data);
  }, [id]);

  if (!product) return <div className="p-8 text-center">Đang tải sản phẩm hoặc không tìm thấy...</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" asChild className="-ml-2">
          <Link href="/manager/products">
            <ChevronLeft className="mr-2 h-4 w-4" /> Quay lại
          </Link>
        </Button>
        <Button asChild variant="outline">
          <Link href={`/manager/products/edit/${product.id}`}>
            <Pencil className="mr-2 h-4 w-4" /> Chỉnh sửa
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Cột trái: Hình ảnh */}
        <Card className="md:col-span-1 overflow-hidden">
          <CardContent className="p-0 aspect-square relative bg-muted">
            {product.imageUrl ? (
              <Image
                src={product.imageUrl}
                alt={product.name}
                fill
                className="object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <ImageIcon className="h-12 w-12 text-muted-foreground" />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Cột phải: Thông tin chi tiết */}
        <Card className="md:col-span-2">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <Badge variant="secondary" className="mb-2">Sản phẩm</Badge>
                <CardTitle className="text-3xl font-bold">{product.name}</CardTitle>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-3 p-3 rounded-lg border bg-slate-50 dark:bg-slate-900">
                <Tag className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground uppercase font-bold">Mã SKU</p>
                  <p className="font-mono font-medium">{product.sku}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-3 rounded-lg border bg-slate-50 dark:bg-slate-900">
                <Package className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground uppercase font-bold">Đơn vị tính</p>
                  <p className="font-medium">{product.baseUnit}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-3 rounded-lg border bg-slate-50 dark:bg-slate-900">
                <Calendar className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground uppercase font-bold">Hạn sử dụng</p>
                  <p className="font-medium">{product.shelfLifeDays} ngày</p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t">
              <h4 className="font-semibold mb-2">Mô tả hệ thống</h4>
              <p className="text-sm text-muted-foreground">
                Sản phẩm này hiện đang được quản lý trong kho phân phối của Manager. 
                Mọi thay đổi về SKU hoặc Hạn sử dụng sẽ ảnh hưởng đến kế hoạch sản xuất 
                và cung ứng cho các Franchise.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}