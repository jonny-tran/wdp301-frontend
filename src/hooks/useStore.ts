/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import { storeRequest } from "@/apiRequest/store";
import { handleErrorApi } from "@/lib/errors";
import { StoreDemandPatternQueryType } from "@/schemas/analytics";
import { CreateStoreBodyType, UpdateStoreBodyType } from "@/schemas/store";
import { QueryStore } from "@/types/store";
import { KEY, QUERY_KEY } from "@/utils/constant";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useStore = () => {
    const queryClient = useQueryClient();
    const createStore = useMutation({
        mutationFn: async (data: CreateStoreBodyType) => {
            const res = await storeRequest.createStore(data)
            return res.data
        },
        onSuccess: () => {
            toast.success('Tạo store thành công')
            queryClient.invalidateQueries({ queryKey: KEY.stores })
        },
    })

    const updateStore = useMutation({
        mutationFn: async ({ id, data }: { id: string, data: UpdateStoreBodyType }) => {
            const res = await storeRequest.updateStore(id, data)
            return res.data
        },
        onSuccess: () => {
            toast.success('Cập nhật store thành công')
            queryClient.invalidateQueries({ queryKey: KEY.stores })
        },
    })

    const deleteStore = useMutation({
        mutationFn: async (id: string) => {
            const res = await storeRequest.deleteStore(id)
            return res.data
        },
        onSuccess: () => {
            toast.success('Xóa store thành công')
            queryClient.invalidateQueries({ queryKey: KEY.stores })
        },
        onError: (error) => {
            handleErrorApi({ error })
        }
    })

    const storeList = (query: QueryStore) => {
        return useQuery({
            queryKey: QUERY_KEY.stores.list(query),
            queryFn: async () => {
                const res = await storeRequest.getStores(query)
                return res.data
            }
        })
    }

    const storeDetail = (id: string) => {
        return useQuery({
            queryKey: QUERY_KEY.stores.detail(id),
            queryFn: async () => {
                const res = await storeRequest.getStoreDetail(id)
                return res.data
            },
            enabled: !!id
        })
    }

    const storeReliabilityAnalytics = () => {
        return useQuery({
            queryKey: KEY.storeReliabilityAnalytics,
            queryFn: async () => {
                const res = await storeRequest.getStoreReliabilityAnalytics()
                return res.data
            }
        })
    }

    const storeDemandPatternAnalytics = (params: StoreDemandPatternQueryType) => {
        return useQuery({
            queryKey: QUERY_KEY.analytics.storeDemandPattern(params),
            queryFn: async () => {
                const res = await storeRequest.getStoreDemandPatternAnalytics(params)
                return res.data
            }
        })
    }
    const createStoreStaff = useMutation({
    mutationFn: async (data: { staff: any[] }) => {
        // Gọi đúng hàm trong storeRequest
        const res = await storeRequest.createStaff(data); 
        return res.data;
    },
    onSuccess: (data: any) => {
            const count = data?.count || 0;
        toast.success(`Đã ghi danh ${count} nhân sự thành công!`);
        queryClient.invalidateQueries({ queryKey: KEY.stores });
    },
    onError: (error) => {
        handleErrorApi({ error });
    }
    });
    // 1. Lấy danh sách nhân viên đang chờ duyệt
  const pendingStaffList = () => {
    return useQuery({
      queryKey: ["staff", "pending"],
      queryFn: async () => {
        const res = await storeRequest.getPendingStaff();
        return res.data; // Mảng staff từ API bạn cung cấp
      }
    });
  };

  // 2. Phê duyệt nhân viên
  const approveStaff = useMutation({
    mutationFn: (id: string) => storeRequest.approveStaff(id),
    onSuccess: () => {
      toast.success("Đã phê duyệt nhân viên thành công");
      queryClient.invalidateQueries({ queryKey: ["staff", "pending"] });
    }
  });

  // 3. Từ chối nhân viên
  const rejectStaff = useMutation({
    mutationFn: ({ id, reason }: { id: string, reason: string }) => 
      storeRequest.rejectStaff(id, reason),
    onSuccess: () => {
      toast.success("Đã từ chối yêu cầu");
      queryClient.invalidateQueries({ queryKey: ["staff", "pending"] });
    }
  });

    return {
        createStore,
        createStoreStaff,
        updateStore,
        deleteStore,
        storeList,
        storeDetail,
        storeReliabilityAnalytics,
        storeDemandPatternAnalytics,
        pendingStaffList, 
        approveStaff, 
        rejectStaff
    }
}

