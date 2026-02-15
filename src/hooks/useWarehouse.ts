'use client'
import { warehouseRequest } from "@/apiRequest/warehouse";
import { handleErrorApi } from "@/lib/errors";
import { FinalizeBulkShipmentBodyType, ReportIssueBodyType } from "@/schemas/warehouse";
import { QueryPickingTask } from "@/types/warehouse";
import { QUERY_KEY } from "@/utils/constant";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useWarehouse = () => {
    const getPickingTaskList = (query: QueryPickingTask) => useQuery({
        queryKey: QUERY_KEY.pickingTaskList(query),
        queryFn: async () => {
            const res = await warehouseRequest.getWarehouses(query)
            return res.data
        }
    })
    const getPickingTaskDetail = (id: string) => {
        return useQuery({
            queryKey: QUERY_KEY.pickingTaskDetail(id),
            queryFn: async () => {
                const res = await warehouseRequest.getPickingTaskDetail(id)
                return res.data
            },
            enabled: !!id
        })
    }
    const resetPickingTask = useMutation({
        mutationFn: async (orderId: string) => {
            const res = await warehouseRequest.resetPickingTask(orderId)
            return res.data
        },
        onError: (error) => {
            handleErrorApi({ error })
        }
    })

    const finalizeBulkShipment = useMutation({
        mutationFn: async (data: FinalizeBulkShipmentBodyType) => {
            const res = await warehouseRequest.finalizeBulkShipment(data)
            return res.data
        },
        onError: (error) => {
            handleErrorApi({ error })
        }
    })

    const reportIssue = useMutation({
        mutationFn: async (data: ReportIssueBodyType) => {
            const res = await warehouseRequest.reportIssue(data)
            return res.data
        },
        onError: (error) => {
            handleErrorApi({ error })
        }
    })

    const pickingTaskDetail = (id: string) => {
        return useQuery({
            queryKey: QUERY_KEY.pickingTaskDetail(id),
            queryFn: async () => {
                const res = await warehouseRequest.getPickingTaskDetail(id)
                return res.data
            },
            enabled: !!id
        })
    }
    const shipmentLabel = (id: string) => {
        return useQuery({
            queryKey: QUERY_KEY.shipmentLabel(id),
            queryFn: async () => {
                const res = await warehouseRequest.getShipmentLabel(id)
                return res.data
            },
            enabled: !!id
        })
    }
    const scanCheckBatch = (batchCode: string) => {
        return useQuery({
            queryKey: QUERY_KEY.scanCheckBatch(batchCode),
            queryFn: async () => {
                const res = await warehouseRequest.scanCheckBatch(batchCode)
                return res.data
            },
            enabled: !!batchCode
        })
    }

    return {
        getPickingTaskList,
        getPickingTaskDetail,
        resetPickingTask,
        finalizeBulkShipment,
        reportIssue,
        pickingTaskDetail,
        shipmentLabel,
        scanCheckBatch
    }
}


