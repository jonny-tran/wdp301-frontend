'use client'
import { productRequest } from "@/apiRequest/product";
import { handleErrorApi } from "@/lib/errors";
import { CreateProductBodyType, UpdateBatchBodyType, UpdateProductBodyType } from "@/schemas/product";
import { QueryBatch, QueryProduct } from "@/types/product";
import { KEY, QUERY_KEY } from "@/utils/constant";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useProduct = () => {
  const queryClient = useQueryClient();
  const createProduct = useMutation({
    mutationFn: async (data: CreateProductBodyType) => {
      const res = await productRequest.createProduct(data)
      return res.data
    },
    onSuccess: () => {
      toast.success('Tạo sản phẩm thành công')
      queryClient.invalidateQueries({ queryKey: KEY.products })
    },
  })

  const updateProduct = useMutation({
    mutationFn: async ({ id, data }: { id: number, data: UpdateProductBodyType }) => {
      const res = await productRequest.updateProduct(id, data)
      return res.data
    },
    onSuccess: () => {
<<<<<<< HEAD
      toast.success('Hệ thống đã cập nhật sản phẩm!')
=======
      toast.success('Sản phẩm đã được cập nhật')
>>>>>>> 0da73fcc42b54874fcaea53673fda727cc87773c
      queryClient.invalidateQueries({ queryKey: KEY.products })
    },
  })

  const deleteProduct = useMutation({
    mutationFn: async (id: number) => {
      const res = await productRequest.deleteProduct(id)
      return res.data
    },
    onSuccess: () => {
<<<<<<< HEAD
      toast.success('Sản phẩm đã được xóa thành công')
=======
      toast.success('Sản phẩm đã được xóa')
>>>>>>> 0da73fcc42b54874fcaea53673fda727cc87773c
      queryClient.invalidateQueries({ queryKey: KEY.products })
    },
    onError: (error) => {
      handleErrorApi({ error })
    }
  })

  const restoreProduct = useMutation({
    mutationFn: async (id: number) => {
      const res = await productRequest.restoreProduct(id)
      return res.data
    },
    onSuccess: () => {
<<<<<<< HEAD
      toast.success('Sản phẩm đã được phục hồi')
=======
      toast.success('Sản phẩm đã được khôi phục')
>>>>>>> 0da73fcc42b54874fcaea53673fda727cc87773c
      queryClient.invalidateQueries({ queryKey: KEY.products })
    },
    onError: (error) => {
      handleErrorApi({ error })
    }
  })

  const updateBatch = useMutation({
    mutationFn: async ({ id, data }: { id: number, data: UpdateBatchBodyType }) => {
      const res = await productRequest.updateBatch(id, data)
      return res.data
    },
    onSuccess: () => {
<<<<<<< HEAD
      toast.success('Thành công cập nhật lô hàng')
=======
      toast.success('Cập nhật lô hàng thành công')
>>>>>>> 0da73fcc42b54874fcaea53673fda727cc87773c
      queryClient.invalidateQueries({ queryKey: KEY.products })
    },

  })

  const productList = (query: QueryProduct) => {
    return useQuery({
      queryKey: QUERY_KEY.products.list(query),
      queryFn: async () => {
        const res = await productRequest.getProducts(query)
        return res.data
      }
    })
  }

  const productDetail = (id: number) => {
    return useQuery({
      queryKey: QUERY_KEY.products.detail(id),
      queryFn: async () => {
        const res = await productRequest.getProductDetail(id)
        return res.data
      },
      enabled: !!id
    })
  }

  const batchList = (query: QueryBatch) => {
    return useQuery({
      queryKey: QUERY_KEY.products.batchList(query),
      queryFn: async () => {
        const res = await productRequest.getBatches(query)
        return res.data
      }
    })
  }

  const batchDetail = (id: number) => {
    return useQuery({
      queryKey: QUERY_KEY.products.batchDetail(id),
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

