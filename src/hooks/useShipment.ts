'use client'
import { shipmentRequest } from "@/apiRequest/shipment";
import { handleErrorApi } from "@/lib/errors";
import { ReceiveShipmentBodyType } from "@/schemas/shipment";
import { QueryShipment } from "@/types/shipment";
import { QUERY_KEY } from "@/utils/constant";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useShipment = () => {
    const receiveAllShipment = useMutation({
        mutationFn: async (id: string) => {
            const res = await shipmentRequest.receiveAllShipment(id)
            return res.data
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
        onError: (error) => {
            handleErrorApi({ error })
        }
    })

    const shipmentList = (query: QueryShipment) => {
        return useQuery({
            queryKey: QUERY_KEY.shipmentList(query),
            queryFn: async () => {
                const res = await shipmentRequest.getShipments(query)
                return res.data
            }
        })
    }
    const myStoreShipmentList = (query: QueryShipment) => {
        return useQuery({
            queryKey: QUERY_KEY.myStoreShipmentList(query),
            queryFn: async () => {
                const res = await shipmentRequest.getMyStoreShipments(query)
                return res.data
            }
        })
    }
    const shipmentDetail = (id: string) => {
        return useQuery({
            queryKey: QUERY_KEY.shipmentDetail(id),
            queryFn: async () => {
                const res = await shipmentRequest.getShipmentDetail(id)
                return res.data
            },
            enabled: !!id
        })
    }
    const shipmentPickingList = (id: string) => {
        return useQuery({
            queryKey: QUERY_KEY.shipmentPickingList(id),
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

