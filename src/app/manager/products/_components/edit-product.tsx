"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  useUpdateProductMutation,
  useGetProductDetail,
} from "@/hooks/useProduct";
import { CreateProductSchema, CreateProductType } from "@/schemas/product";
import { handleErrorApi } from "@/lib/errors";
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
import { useRouter, useParams } from "next/navigation";
import { Loader2, ArrowLeft } from "lucide-react";

export default function EditProduct() {
  const router = useRouter();
  const { id } = useParams();
  const updateProductMutation = useUpdateProductMutation();

  // 1. Lấy dữ liệu - 'response' lúc này là kiểu ResponseData
  const { data: response, isLoading } = useGetProductDetail(id as string);

  // Bóc tách product từ lớp vỏ response.data để tránh lỗi undefined
  const product = response?.data;

  const form = useForm<CreateProductType>({
    resolver: zodResolver(CreateProductSchema),
    defaultValues: {
      name: "",
      baseUnitId: 0,
      shelfLifeDays: 0,
      imageUrl: "",
    },
  });

  // 2. Đồng bộ dữ liệu từ API vào Form khi tải xong
  useEffect(() => {
    if (product) {
      form.reset({
        name: product.name,
        baseUnitId: product.baseUnitId, // Đã cập nhật theo JSON của bạn
        shelfLifeDays: product.shelfLifeDays,
        imageUrl: product.imageUrl || "",
      });
    }
  }, [product, form]);

  async function onSubmit(values: CreateProductType) {
    try {
      await updateProductMutation.mutateAsync({
        id: id as string,
        body: values,
      });
      router.push("/manager/products");
    } catch (error: unknown) {
      handleErrorApi({
        error,
        setError: form.setError,
      });
    }
  }

  if (isLoading)
    return (
      <div className="flex flex-col items-center justify-center p-20 gap-2">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">
          Đang tải thông tin sản phẩm...
        </p>
      </div>
    );

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg border shadow-sm">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h2 className="text-2xl font-bold">Chỉnh sửa sản phẩm</h2>
          <p className="text-sm text-muted-foreground">
            Mã SKU:{" "}
            <span className="font-mono font-bold text-primary">
              {product?.sku}
            </span>
          </p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="baseUnitId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ID Đơn vị tính</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
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
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="imageUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Link ảnh sản phẩm</FormLabel>
                <FormControl>
                  <Input placeholder="https://..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex gap-4 justify-end border-t pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
            >
              Hủy bỏ
            </Button>
            <Button type="submit" disabled={updateProductMutation.isPending}>
              {updateProductMutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Lưu thay đổi
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
