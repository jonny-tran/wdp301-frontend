'use client'
import { shipmentRequest } from "@/apiRequest/shipment";
import { handleErrorApi } from "@/lib/errors";
import { ReceiveShipmentBodyType } from "@/schemas/shipment";
import { QueryShipment } from "@/types/shipment";
import { KEY, QUERY_KEY } from "@/utils/constant";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useShipment = () => {
    const queryClient = useQueryClient();
    const receiveAllShipment = useMutation({
        mutationFn: async (id: string) => {
            const res = await shipmentRequest.receiveAllShipment(id)
            return res.data
        },
        onSuccess: () => {
            toast.success('Shipment received successfully')
            queryClient.invalidateQueries({ queryKey: KEY.shipments })
        },
        onError: (error) => {
            handleErrorApi({ error })
        }
    })

    const receiveShipment = useMutation({
        mutationFn: async ({ id, data }: { id: string, data: ReceiveShipmentBodyType }) => {
            const res = await shipmentRequest.receiveShipment(id, data)
            return res.data
        },
        onSuccess: () => {
            toast.success('Shipment received successfully')
            queryClient.invalidateQueries({ queryKey: KEY.shipments })
        },
    })

    const shipmentList = (query: QueryShipment) => {
        return useQuery({
            queryKey: QUERY_KEY.shipments.list(query),
            queryFn: async () => {
                const res = await shipmentRequest.getShipments(query)
                return res.data
            }
        })
    }
    const myStoreShipmentList = (query: QueryShipment) => {
        return useQuery({
            queryKey: QUERY_KEY.shipments.myStore(query),
            queryFn: async () => {
                const res = await shipmentRequest.getMyStoreShipments(query)
                return res.data
            }
        })
    }
    const shipmentDetail = (id: string) => {
        return useQuery({
            queryKey: QUERY_KEY.shipments.detail(id),
            queryFn: async () => {
                const res = await shipmentRequest.getShipmentDetail(id)
                return res.data
            },
            enabled: !!id
        })
    }
    const shipmentPickingList = (id: string) => {
        return useQuery({
            queryKey: QUERY_KEY.shipments.pickingList(id),
            queryFn: async () => {
                const res = await shipmentRequest.getShipmentPickingList(id)
                return res.data
            },
            enabled: !!id
        })
    }

    return {
        receiveAllShipment,
        receiveShipment,
        shipmentList,
        myStoreShipmentList,
        shipmentDetail,
        shipmentPickingList
    }
}

