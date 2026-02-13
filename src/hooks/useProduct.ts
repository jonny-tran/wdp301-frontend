'use client'
import { productRequest } from "@/apiRequest/product";
import { CreateProductBodyType, UpdateBatchBodyType, UpdateProductBodyType } from "@/schemas/product";
import { QueryBatch, QueryProduct } from "@/types/product";
import { QUERY_KEY } from "@/utils/constant";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useProduct = () => {
    const createProduct = useMutation({
        mutationFn: async (data: CreateProductBodyType) => {
            const res = await productRequest.createProduct(data)
            return res.data
        }
    })

    const updateProduct = useMutation({
        mutationFn: async ({ id, data }: { id: number | string, data: UpdateProductBodyType }) => {
            const res = await productRequest.updateProduct(id, data)
            return res.data
        }
    })

    const deleteProduct = useMutation({
        mutationFn: async (id: number | string) => {
            const res = await productRequest.deleteProduct(id)
            return res.data
        }
    })

    const restoreProduct = useMutation({
        mutationFn: async (id: number | string) => {
            const res = await productRequest.restoreProduct(id)
            return res.data
        }
    })

    const updateBatch = useMutation({
        mutationFn: async ({ id, data }: { id: number | string, data: UpdateBatchBodyType }) => {
            const res = await productRequest.updateBatch(id, data)
            return res.data
        }
    })

    const productList = (query: QueryProduct) => {
        return useQuery({
            queryKey: QUERY_KEY.productList(query),
            queryFn: async () => {
                const res = await productRequest.getProducts(query)
                return res.data
            }
        })
    }

    const productDetail = (id: number | string) => {
        return useQuery({
            queryKey: QUERY_KEY.productDetail(id),
            queryFn: async () => {
                const res = await productRequest.getProductDetail(id)
                return res.data
            },
            enabled: !!id
        })
    }

    const batchList = (query: QueryBatch) => {
        return useQuery({
            queryKey: QUERY_KEY.batchList(query),
            queryFn: async () => {
                const res = await productRequest.getBatches(query)
                return res.data
            }
        })
    }

    const batchDetail = (id: number | string) => {
        return useQuery({
            queryKey: QUERY_KEY.batchDetail(id),
            queryFn: async () => {
                const res = await productRequest.getBatchDetail(id)
                return res.data
            },
            enabled: !!id
        })
    }

    return {
        createProduct,
        updateProduct,
        deleteProduct,
        restoreProduct,
        updateBatch,
        productList,
        productDetail,
        batchList,
        batchDetail
    }
}

// export const useGetProductDetail = (id: number | string) => {
//     return useQuery({
//         queryKey: ['product', id],
//         queryFn: async () => {
//             const res = await productRequest.getProductDetail(id)
//             return res.data
//         },
//         enabled: !!id
//     })
// }

// export const useGetBatchDetail = (id: number | string) => {
//     return useQuery({
//         queryKey: ['batch', id],
//         queryFn: async () => {
//             const res = await productRequest.getBatchDetail(id)
//             return res.data
//         },
//         enabled: !!id
//     })
// }
