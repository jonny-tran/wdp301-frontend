// src/apiRequest/product.ts
import http from "@/lib/http";
import { ResponseData } from "@/types/base";
import { Product } from "@/types/product";
import { Batch } from "@/types/batch";

// Định nghĩa interface cho dữ liệu phân trang trả về từ GET /products
export interface ProductListResponse {
  items: Product[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Định nghĩa body cho các request tạo/cập nhật
export interface CreateProductBody {
  name: string;
  baseUnitId: number;
  shelfLifeDays: number;
  imageUrl: string;
}

export const productApiRequest = {
  /**
   * Lấy danh sách sản phẩm (có phân trang)
   * GET //products?page=1&limit=10
   */
  getList: (page: number, limit: number) =>
    http.get<ResponseData<ProductListResponse>>(
      `/products?page=${page}&limit=${limit}`
    ),

  /**
   * Tạo sản phẩm mới
   * POST //products
   */
  create: (body: CreateProductBody) =>
    http.post<ResponseData<Product>>("//products", body),

  /**
   * Lấy chi tiết một sản phẩm (bao gồm danh sách batches)
   * GET //products/{id}
   */
  getDetail: (id: number | string) =>
    http.get<ResponseData<Product & { batches: Batch[] }>>(
      `/products/${id}`
    ),

  /**
   * Cập nhật thông tin sản phẩm
   * PATCH //products/{id}
   */
  update: (id: number | string, body: Partial<CreateProductBody>) =>
    http.patch<ResponseData<Product>>(`/products/${id}`, body),

  /**
   * Xóa sản phẩm (Soft delete)
   * DELETE //products/{id}
   */
  delete: (id: number | string) =>
    http.delete<ResponseData<{ message: string }>>(
      `/products/${id}`
    ),

  /**
   * Lấy danh sách sản phẩm đã bị xóa/vô hiệu hóa
   * GET //products/inactive
   */
  getInactive: () =>
    http.get<ResponseData<Product[]>>("/products/inactive"),

  /**
   * Khôi phục sản phẩm từ trạng thái inactive
   * PATCH //products/{id}/restore
   */
  restore: (id: number | string) =>
    http.patch<ResponseData<Product>>(
      `/products/${id}/restore`,
      {}
    ),

  /**
   * API liên quan đến Batch (Lô hàng)
   */
  
  // Lấy tất cả các lô hàng của tất cả sản phẩm
  getAllBatches: () =>
    http.get<ResponseData<Batch[]>>("/products/batches"),

  // Lấy chi tiết 1 lô hàng
  getBatchDetail: (batchId: number | string) =>
    http.get<ResponseData<Batch>>(`/products/batches/${batchId}`),

  // Cập nhật thông tin lô hàng
  updateBatch: (batchId: number | string, body: any) =>
    http.patch<ResponseData<Batch>>(
      `/products/batches/${batchId}`,
      body
    ),

  // Tạo một lô hàng mới cho một sản phẩm cụ thể
  createBatch: (productId: number | string, body: any) =>
    http.post<ResponseData<Batch>>(
      `/products/${productId}/batches`,
      body
    ),
};