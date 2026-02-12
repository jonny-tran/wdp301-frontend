// src/hooks/useProduct.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { productApiRequest, CreateProductBody } from "@/apiRequest/product";
import { toast } from "sonner";
import { handleErrorApi } from "@/lib/errors";

/**
 * Hook lấy danh sách sản phẩm (có phân trang)
 */
export const useGetProducts = (page: number, limit: number) => {
  return useQuery({
    queryKey: ["products", page, limit],
    queryFn: () => productApiRequest.getList(page, limit),
    // Ép kiểu dữ liệu trả về để Component nhận diện được cấu trúc
    select: (response) => response.data,  
  });
};

/**
 * Hook lấy chi tiết sản phẩm và các lô hàng (batches) đi kèm
 */
export const useGetProductDetail = (id: number | string) => {
  return useQuery({
    queryKey: ["product-detail", id],
    queryFn: () => productApiRequest.getDetail(id),
    enabled: !!id, // Chỉ chạy khi có ID
  });
};

/**
 * Hook tạo mới sản phẩm
 */
export const useCreateProductMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: productApiRequest.create,
    onSuccess: () => {
      toast.success("Tạo sản phẩm thành công!");
      // Làm mới danh sách sản phẩm để UI cập nhật dòng mới
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
    onError: (error) => handleErrorApi({ error }),
  });
};

/**
 * Hook cập nhật sản phẩm
 */
export const useUpdateProductMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: { id: number | string; body: Partial<CreateProductBody> }) => 
      productApiRequest.update(id, body),
    onSuccess: (_, variables) => {
      toast.success("Cập nhật thông tin thành công");
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["product-detail", variables.id] });
    },
    onError: (error) => handleErrorApi({ error }),
  });
};

/**
 * Hook xóa sản phẩm (Soft Delete)
 */
export const useDeleteProductMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: productApiRequest.delete,
    onSuccess: () => {
      toast.success("Sản phẩm đã được chuyển vào kho lưu trữ");
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
    onError: (error) => handleErrorApi({ error }),
  });
};

/**
 * Hook khôi phục sản phẩm
 */
export const useRestoreProductMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: productApiRequest.restore,
    onSuccess: () => {
      toast.success("Khôi phục sản phẩm thành công");
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
    onError: (error) => handleErrorApi({ error }),
  });
};