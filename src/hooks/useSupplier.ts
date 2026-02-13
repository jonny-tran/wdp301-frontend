'use client'
import { supplierRequest } from "@/apiRequest/supplier";
import { CreateSupplierBodyType, UpdateSupplierBodyType } from "@/schemas/supplier";
import { QuerySupplier } from "@/types/supplier";
import { QUERY_KEY } from "@/utils/constant";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useSupplier = () => {
    const createSupplier = useMutation({
        mutationFn: async (data: CreateSupplierBodyType) => {
            const res = await supplierRequest.createSupplier(data)
            return res.data
        }
    })

    const updateSupplier = useMutation({
        mutationFn: async ({ id, data }: { id: number | string, data: UpdateSupplierBodyType }) => {
            const res = await supplierRequest.updateSupplier(id, data)
            return res.data
        }
    })

    const deleteSupplier = useMutation({
        mutationFn: async (id: number | string) => {
            const res = await supplierRequest.deleteSupplier(id)
            return res.data
        }
    })

    const supplierList = (query: QuerySupplier) => {
        return useQuery({
            queryKey: QUERY_KEY.supplierList(query),
            queryFn: async () => {
                const res = await supplierRequest.getSuppliers(query)
                return res.data
            }
        })
    }

    const supplierDetail = (id: number | string) => {
        return useQuery({
            queryKey: QUERY_KEY.supplierDetail(id),
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

