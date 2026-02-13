"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Pencil, Trash, Eye } from "lucide-react";
import { useDeleteProductMutation } from "@/hooks/useProduct";
import { Product } from "@/types/product";
import { useRouter } from "next/navigation"; // Import useRouter

export function ProductTableActions({ product }: { product: Product }) {
  const router = useRouter(); // Khởi tạo router
  const deleteMutation = useDeleteProductMutation();

  const handleDelete = async () => {
    // Thay confirm bằng AlertDialog nếu bạn muốn UI đẹp hơn
    if (confirm(`Bạn có chắc muốn xóa sản phẩm ${product.name}?`)) {
      await deleteMutation.mutateAsync(product.id);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Hành động</DropdownMenuLabel>

        {/* Xem chi tiết */}
        <DropdownMenuItem
          className="cursor-pointer"
          onClick={() => router.push(`/manager/products/${product.id}`)}
        >
          <Eye className="mr-2 h-4 w-4" /> Xem chi tiết
        </DropdownMenuItem>

        {/* Chỉnh sửa */}
        <DropdownMenuItem
          className="cursor-pointer"
          onClick={() => router.push(`/manager/products/${product.id}/edit`)}
        >
          <Pencil className="mr-2 h-4 w-4" /> Chỉnh sửa
        </DropdownMenuItem>

        {/* Xóa */}
        <DropdownMenuItem
          className="cursor-pointer text-destructive focus:text-destructive"
          onClick={handleDelete}
        >
          <Trash className="mr-2 h-4 w-4" /> Xóa sản phẩm
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
