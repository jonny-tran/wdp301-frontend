'use client'
import { logisticsRequest } from "@/apiRequest/logistics";
import { CreateRouteBodyType, CreateVehicleBodyType } from "@/types/logistics";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useLogistics = () => {
    const queryClient = useQueryClient();
    const LOGISTICS_KEY = ['logistics'];

    // --- VEHICLE HOOKS ---
    const useGetVehicles = () => useQuery({
        queryKey: [...LOGISTICS_KEY, 'vehicles'],
        queryFn: async () => {
            const res = await logisticsRequest.getVehicles();
            return res.data;
        }
    });

    const useCreateVehicle = useMutation({
        mutationFn: (data: CreateVehicleBodyType) => logisticsRequest.createVehicle(data),
        onSuccess: () => {
            toast.success('Thêm phương tiện thành công');
            queryClient.invalidateQueries({ queryKey: [...LOGISTICS_KEY, 'vehicles'] });
        }
    });

    const useDeleteVehicle = useMutation({
        mutationFn: (id: number) => logisticsRequest.deleteVehicle(id),
        onSuccess: () => {
            toast.success('Xóa phương tiện thành công');
            queryClient.invalidateQueries({ queryKey: [...LOGISTICS_KEY, 'vehicles'] });
        }
    });

    // --- ROUTE HOOKS ---
    const useGetRoutes = () => useQuery({
        queryKey: [...LOGISTICS_KEY, 'routes'],
        queryFn: async () => {
            const res = await logisticsRequest.getRoutes();
            return res.data;
        }
    });

    const useCreateRoute = useMutation({
        mutationFn: (data: CreateRouteBodyType) => logisticsRequest.createRoute(data),
        onSuccess: () => {
            toast.success('Thêm tuyến đường thành công');
            queryClient.invalidateQueries({ queryKey: [...LOGISTICS_KEY, 'routes'] });
        }
    });

    return {
        useGetVehicles,
        useCreateVehicle,
        useDeleteVehicle,
        useGetRoutes,
        useCreateRoute
    };
};