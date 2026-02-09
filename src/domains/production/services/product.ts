import http from "@/lib/http";
import { ProductFormValues } from "@/schemas/product";
import { Product } from "@/types/product";

export const productService = {
  createProduct: (data: ProductFormValues) => {
    return http.post("/wdp301-api/v1/products", data);
  },
  
  getProducts: () => {
    return http.get<Product[]>("/wdp301-api/v1/products");
  }
};