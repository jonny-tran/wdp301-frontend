import http from "@/lib/http";
import { CreateSupplierBodyType, UpdateSupplierBodyType } from "@/schemas/supplier";
import { BaseResponePagination } from "@/types/base";
import { QuerySupplier, Supplier } from "@/types/supplier";
import { ENDPOINT_CLIENT } from "@/utils/endponit";

export const supplierRequest = {
    // POST /suppliers
    createSupplier: (data: CreateSupplierBodyType) => http.post<Supplier>(ENDPOINT_CLIENT.SUPPLIERS, data),

    // GET /suppliers/:id
    getSupplierDetail: (id: string) => http.get<Supplier>(ENDPOINT_CLIENT.SUPPLIER_DETAIL(id)),

    // PATCH /suppliers/:id
    updateSupplier: (id: string, data: UpdateSupplierBodyType) => http.patch<Supplier>(ENDPOINT_CLIENT.SUPPLIER_DETAIL(id), data),

    // DELETE /suppliers/:id
    deleteSupplier: (id: string) => http.delete(ENDPOINT_CLIENT.SUPPLIER_DETAIL(id)),

    // GET /suppliers
    getSuppliers: (query: QuerySupplier) => http.get<BaseResponePagination<Supplier[]>>(ENDPOINT_CLIENT.SUPPLIERS, { query }),
};
