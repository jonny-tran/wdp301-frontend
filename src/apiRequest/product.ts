import http from "@/lib/http";
import { CreateProductBodyType, UpdateBatchBodyType, UpdateProductBodyType } from "@/schemas/product";
import { BaseResponePagination } from "@/types/base";
import { Batch, Product, QueryBatch, QueryProduct } from "@/types/product";
import { ENDPOINT_CLIENT } from "@/utils/endponit";

export const productRequest = {
    // POST /products
    createProduct: (data: CreateProductBodyType) => http.post<Product>(ENDPOINT_CLIENT.PRODUCTS, data),

    // GET /products/:id
    getProductDetail: (id: number | string) => http.get<Product>(ENDPOINT_CLIENT.PRODUCT_DETAIL(id)),

    // PATCH /products/:id
    updateProduct: (id: number | string, data: UpdateProductBodyType) => http.patch<Product>(ENDPOINT_CLIENT.PRODUCT_DETAIL(id), data),

    // DELETE /products/:id
    deleteProduct: (id: number | string) => http.delete(ENDPOINT_CLIENT.PRODUCT_DETAIL(id)),

    // PATCH /products/:id/restore
    restoreProduct: (id: number | string) => http.patch<Product>(ENDPOINT_CLIENT.RESTORE_PRODUCT(id), {}),

    // GET /products/batches/:id
    getBatchDetail: (id: number | string) => http.get<Batch>(ENDPOINT_CLIENT.BATCH_DETAIL(id)),

    // PATCH /products/batches/:id
    updateBatch: (id: number | string, data: UpdateBatchBodyType) => http.patch<Batch>(ENDPOINT_CLIENT.UPDATE_BATCH(id), data),

    // GET /products
    getProducts: (query: QueryProduct) => http.get<BaseResponePagination<Product[]>>(ENDPOINT_CLIENT.PRODUCTS, { query }),

    // GET /products/batches
    getBatches: (query: QueryBatch) => http.get<BaseResponePagination<Batch[]>>(ENDPOINT_CLIENT.BATCHES, { query }),
};
