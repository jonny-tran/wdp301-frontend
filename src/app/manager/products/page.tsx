"use client";

import { useState } from "react";
import { MOCK_PRODUCTS } from "@/constants/mock-data";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, Plus, ImageIcon } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";

export default function ProductListPage() {
  const [products, setProducts] = useState(MOCK_PRODUCTS);

  const handleDelete = (id: string) => {
    if (confirm("Xác nhận xóa sản phẩm?")) {
      setProducts((prev) => prev.filter((p) => p.id !== id));
      toast.success("Đã xóa (Mock data)");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">Quản lý Sản phẩm</h1>
        <Button asChild>
          <Link href="/manager/products/create">
            <Plus className="mr-2 h-4 w-4" /> Thêm mới
          </Link>
        </Button>
      </div>

      <div className="rounded-md border bg-card shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-80px">Ảnh</TableHead>
              <TableHead>SKU</TableHead>
              <TableHead>Tên sản phẩm</TableHead>
              <TableHead>Đơn vị</TableHead>
              <TableHead>Hạn dùng</TableHead>
              <TableHead className="text-right">Hành động</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell>
                  <div className="relative h-12 w-12 rounded-lg overflow-hidden border bg-muted">
                    {product.imageUrl ? (
                      <Image
                        src={product.imageUrl}
                        alt={product.name}
                        fill
                        sizes="48px"
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <ImageIcon className="h-6 w-6 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell className="font-mono text-sm">
                  {product.sku}
                </TableCell>
                <TableCell className="font-medium">{product.name}</TableCell>
                <TableCell>{product.baseUnit}</TableCell>
                <TableCell>{product.shelfLifeDays} ngày</TableCell>
                <TableCell className="text-right space-x-2">
                  <Button variant="outline" size="icon" asChild>
                    <Link href={`/manager/products/edit/${product.id}`}>
                      <Pencil className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => handleDelete(product.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
                <TableCell className="text-right space-x-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/manager/products/${product.id}`}>
                      Chi tiết
                    </Link>
                  </Button>
                  <Button variant="outline" size="icon" asChild title="Sửa">
                    <Link href={`/manager/products/edit/${product.id}`}>
                      <Pencil className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => handleDelete(product.id)}
                    title="Xóa"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
