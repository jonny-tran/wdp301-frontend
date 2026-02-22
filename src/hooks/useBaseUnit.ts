'use client'
import { baseUnitRequest } from "@/apiRequest/base-unit";
import { handleErrorApi } from "@/lib/errors";
import { CreateBaseUnitBodyType, UpdateBaseUnitBodyType } from "@/schemas/base-unit";
import { KEY, QUERY_KEY } from "@/utils/constant";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";


export const useBaseUnit = () => {
    const queryClient = useQueryClient();

    const baseUnitList = () => {
        return useQuery({
            queryKey: QUERY_KEY.baseUnits.list(),
            queryFn: async () => {
                const res = await baseUnitRequest.getBaseUnits()
                return res.data
            }
        })
    }

    const baseUnitDetail = (id: number) => {
        return useQuery({
            queryKey: QUERY_KEY.baseUnits.detail(id),
            queryFn: async () => {
                const res = await baseUnitRequest.getBaseUnitDetail(id)
                return res.data
            },
            enabled: !!id
        })
    }

    const createBaseUnit = useMutation({
        mutationFn: async (data: CreateBaseUnitBodyType) => {
            const res = await baseUnitRequest.createBaseUnit(data)
            return res.data;
        },
        onSuccess: () => {
            toast.success('Base unit created successfully')
            queryClient.invalidateQueries({ queryKey: KEY.baseUnits })
        },
    })

    const updateBaseUnit = useMutation({
        mutationFn: async ({ id, data }: { id: number, data: UpdateBaseUnitBodyType }) => {
            const res = await baseUnitRequest.updateBaseUnit(id, data)
            return res.data
        },
        onSuccess: () => {
            toast.success('Base unit updated successfully')
            queryClient.invalidateQueries({ queryKey: KEY.baseUnits })
        },
    })

    const deleteBaseUnit = useMutation({
        mutationFn: async (id: number) => {
            const res = await baseUnitRequest.deleteBaseUnit(id)
            return res.message
        },
        onSuccess: () => {
            toast.success('Base unit deleted successfully')
            queryClient.invalidateQueries({ queryKey: KEY.baseUnits })
        },
        onError: (error) => {
            handleErrorApi({ error })
        }
    })

    return {
        baseUnitList,
        baseUnitDetail,
        createBaseUnit,
        updateBaseUnit,
        deleteBaseUnit
    }
}
