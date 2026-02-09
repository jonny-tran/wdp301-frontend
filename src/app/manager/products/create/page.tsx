"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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

export default function CreateProductPage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

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

  function onSubmit(values: ProductFormValues) {
    setIsLoading(true);
    console.log("Dữ liệu chuẩn bị gửi đi:", values);

    // Giả lập độ trễ của mạng 1 giây
    setTimeout(() => {
      setIsLoading(false);
      alert("UI: Đã nhận dữ liệu thành công (Giả lập)");
      router.push("/manager/products");
    }, 1000);
  }

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      <Button variant="ghost" asChild className="pl-0">
        <Link href="/manager/products" className="flex items-center text-sm">
          <ChevronLeft className="mr-2 h-4 w-4" /> Quay lại danh sách
        </Link>
      </Button>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Tạo sản phẩm mới</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="sku"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mã sản phẩm (SKU)</FormLabel>
                      <FormControl>
                        <Input placeholder="Ví dụ: PROD-001" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tên sản phẩm</FormLabel>
                      <FormControl>
                        <Input placeholder="Nhập tên sản phẩm..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="baseUnit"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Đơn vị tính</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="shelfLifeDays"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Hạn sử dụng (Ngày)</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Đang xử lý..." : "Lưu sản phẩm"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
