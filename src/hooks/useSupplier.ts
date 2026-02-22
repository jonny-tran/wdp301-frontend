'use client'
import { supplierRequest } from "@/apiRequest/supplier";
import { handleErrorApi } from "@/lib/errors";
import { CreateSupplierBodyType, UpdateSupplierBodyType } from "@/schemas/supplier";
import { QuerySupplier } from "@/types/supplier";
import { KEY, QUERY_KEY } from "@/utils/constant";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useSupplier = () => {
    const queryClient = useQueryClient();
    const createSupplier = useMutation({
        mutationFn: async (data: CreateSupplierBodyType) => {
            const res = await supplierRequest.createSupplier(data)
            return res.data
        },
        onSuccess: () => {
            toast.success('Supplier created successfully')
            queryClient.invalidateQueries({ queryKey: KEY.suppliers })
        },
    })

    const updateSupplier = useMutation({
        mutationFn: async ({ id, data }: { id: string, data: UpdateSupplierBodyType }) => {
            const res = await supplierRequest.updateSupplier(id, data)
            return res.data
        },
        onSuccess: () => {
            toast.success('Supplier updated successfully')
            queryClient.invalidateQueries({ queryKey: KEY.suppliers })
        },
    })

    const deleteSupplier = useMutation({
        mutationFn: async (id: string) => {
            const res = await supplierRequest.deleteSupplier(id)
            return res.data
        },
        onSuccess: () => {
            toast.success('Supplier deleted successfully')
            queryClient.invalidateQueries({ queryKey: KEY.suppliers })
        },
        onError: (error) => {
            handleErrorApi({ error })
        }
    })

    const supplierList = (query: QuerySupplier) => {
        return useQuery({
            queryKey: QUERY_KEY.suppliers.list(query),
            queryFn: async () => {
                const res = await supplierRequest.getSuppliers(query)
                return res.data
            }
        })
    }

    const supplierDetail = (id: string) => {
        return useQuery({
            queryKey: QUERY_KEY.suppliers.detail(id),
            queryFn: async () => {
                const res = await supplierRequest.getSupplierDetail(id)
                return res.data
            },
            enabled: !!id
        })
    }

    return {
        createSupplier,
        updateSupplier,
        deleteSupplier,
        supplierList,
        supplierDetail
    }
}

