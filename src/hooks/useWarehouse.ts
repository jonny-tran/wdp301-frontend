"use client";

import { warehouseRequest } from "@/apiRequest/warehouse";
import { handleErrorApi } from "@/lib/errors";
import { CancelPickingTaskBody, FinalizeBulkShipmentBodyType, ReportIssueBodyType } from "@/schemas/warehouse";
import { QueryPickingTask } from "@/types/warehouse";
import { KEY, QUERY_KEY } from "@/utils/constant";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useWarehouse = () => {
    const queryClient = useQueryClient();

    const getPickingTaskList = (query: QueryPickingTask) =>
        useQuery({
            queryKey: QUERY_KEY.warehouse.pickingTaskList(query),
            queryFn: async () => {
                const res = await warehouseRequest.getPickingTasks(query);
                return warehouseRequest.parsePickingTaskPage(res.data, query);
            },
        });

    const getPickingTaskDetail = (id: string) =>
        useQuery({
            queryKey: QUERY_KEY.warehouse.pickingTaskDetail(id),
            queryFn: async () => {
                const res = await warehouseRequest.getPickingTaskDetail(id);
                return warehouseRequest.parsePickingTaskDetail(res.data);
            },
            enabled: !!id && id !== "undefined",
        });

    const resetPickingTask = useMutation({
        mutationFn: async (orderId: string) => {
            const res = await warehouseRequest.resetPickingTask(orderId);
            return res.data;
        },
        onSuccess: () => {
            toast.success("Đơn hàng đã được reset");
            void queryClient.invalidateQueries({ queryKey: KEY.warehouse });
        },
        onError: (error) => {
            handleErrorApi({ error });
        },
    });

    const cancelPickingTask = useMutation({
        mutationFn: async ({ orderId, reason }: { orderId: string; reason: string }) => {
            const body = CancelPickingTaskBody.parse({ reason });
            const res = await warehouseRequest.cancelPickingTask(orderId, body);
            return res.data;
        },
        onSuccess: () => {
            toast.success("Đã hủy tác vụ soạn hàng");
            void queryClient.invalidateQueries({ queryKey: KEY.warehouse });
        },
        onError: (error) => {
            handleErrorApi({ error });
        },
    });

    const finalizeBulkShipment = useMutation({
        mutationFn: async (data: FinalizeBulkShipmentBodyType) => {
            const res = await warehouseRequest.finalizeBulkShipment(data);
            return res.data;
        },
        onSuccess: () => {
            void queryClient.invalidateQueries({ queryKey: KEY.warehouse });
        },
        onError: (error) => {
            handleErrorApi({ error });
        },
    });

    const reportIssue = useMutation({
        mutationFn: async (data: ReportIssueBodyType) => {
            const res = await warehouseRequest.reportIssue(data);
            return res.data;
        },
        onSuccess: () => {
            toast.success("Đã ghi nhận báo cáo sự cố lô");
            void queryClient.invalidateQueries({ queryKey: KEY.warehouse });
        },
        onError: (error) => {
            handleErrorApi({ error });
        },
    });

    /** Xác nhận lô: GET /warehouse/scan-check?batchCode= (BE không có POST trên path này). */
    const verifyScanCheck = useMutation({
        mutationFn: async (batchCode: string) => {
            const res = await warehouseRequest.scanCheckBatch(batchCode.trim());
            return warehouseRequest.parseScanCheckResult(res.data);
        },
        onError: (error) => {
            handleErrorApi({ error });
        },
    });

    const shipmentLabel = (id: string) =>
        useQuery({
            queryKey: QUERY_KEY.warehouse.shipmentLabel(id),
            queryFn: async () => {
                const res = await warehouseRequest.getShipmentLabel(id);
                return warehouseRequest.parseShipmentLabel(res.data);
            },
            enabled: !!id,
        });

    const scanCheckBatch = (batchCode: string) =>
        useQuery({
            queryKey: QUERY_KEY.warehouse.scanCheckBatch(batchCode),
            queryFn: async () => {
                const res = await warehouseRequest.scanCheckBatch(batchCode);
                return warehouseRequest.parseScanCheckResult(res.data);
            },
            enabled: !!batchCode,
        });

    return {
        getPickingTaskList,
        getPickingTaskDetail,
        resetPickingTask,
        cancelPickingTask,
        finalizeBulkShipment,
        reportIssue,
        verifyScanCheck,
        shipmentLabel,
        scanCheckBatch,
    };
};
