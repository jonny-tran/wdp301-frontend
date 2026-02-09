"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ProductSchema, type ProductFormValues } from "@/schemas/product";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { MOCK_PRODUCTS } from "@/constants/mock-data";

export default function EditProductPage() {
  const params = useParams();
  const router = useRouter();
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(ProductSchema),
    defaultValues: {
      sku: "",
      name: "",
      baseUnit: "Kg",
      shelfLifeDays: 1,
      imageUrl: "",
    },
  });

  // Giả lập lấy dữ liệu cũ từ ID
  useEffect(() => {
    // Tìm sản phẩm trong file mock dựa trên id
    const existingProduct = MOCK_PRODUCTS.find((p) => p.id === id);

    if (existingProduct) {
      form.reset({
        sku: existingProduct.sku,
        name: existingProduct.name,
        baseUnit: existingProduct.baseUnit,
        shelfLifeDays: existingProduct.shelfLifeDays,
        imageUrl: existingProduct.imageUrl || "",
      });
    }
  }, [id, form]);

  function onSubmit(values: ProductFormValues) {
    setIsLoading(true);
    console.log("Dữ liệu cập nhật mới:", values);

    setTimeout(() => {
      setIsLoading(false);
      alert(`Đã cập nhật sản phẩm ${params.id} thành công!`);
      router.push("/manager/products");
    }, 1000);
  }

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      <Button variant="ghost" asChild className="pl-0 text-muted-foreground">
        <Link href="/manager/products">
          <ChevronLeft className="mr-2 h-4 w-4" /> Quay lại
        </Link>
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>Chỉnh sửa sản phẩm</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tên sản phẩm</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Các field khác (sku, baseUnit...) làm tương tự trang Create */}

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => router.back()}
                >
                  {" "}
                  Hủy{" "}
                </Button>
                <Button type="submit" className="flex-1" disabled={isLoading}>
                  {isLoading ? "Đang lưu..." : "Cập nhật thay đổi"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
