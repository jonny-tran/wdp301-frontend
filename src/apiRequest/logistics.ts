import http from "@/lib/http";
import { CreateRouteBodyType, CreateVehicleBodyType, Route, Vehicle } from "@/types/logistics";

export const logisticsRequest = {
    // Vehicles
    getVehicles: () => http.get<Vehicle[]>('/logistics/vehicles'),
    getVehicleDetail: (id: string | number) => http.get<Vehicle>(`/logistics/vehicles/${id}`),
    createVehicle: (data: CreateVehicleBodyType) => http.post<Vehicle>('/logistics/vehicles', data),
    updateVehicle: (id: string | number, data: Partial<CreateVehicleBodyType>) => http.patch<Vehicle>(`/logistics/vehicles/${id}`, data),
    deleteVehicle: (id: string | number) => http.delete(`/logistics/vehicles/${id}`),

    // Routes
    getRoutes: () => http.get<Route[]>('/logistics/routes'),
    getRouteDetail: (id: string | number) => http.get<Route>(`/logistics/routes/${id}`),
    createRoute: (data: CreateRouteBodyType) => http.post<Route>('/logistics/routes', data),
    updateRoute: (id: string | number, data: Partial<CreateRouteBodyType>) => http.patch<Route>(`/logistics/routes/${id}`, data),
    deleteRoute: (id: string | number) => http.delete(`/logistics/routes/${id}`),
};