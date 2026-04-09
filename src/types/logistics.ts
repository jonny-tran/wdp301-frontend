export type VehicleStatus = 'available' | 'in_use' | 'maintenance';

export type Vehicle = {
    id: number;
    licensePlate: string;
    payloadCapacity: string;
    fuelRatePerKm: string;
    status: VehicleStatus;
};

export type Route = {
    id: number;
    routeName: string;
    distanceKm: string;
    estimatedHours: string;
    baseTransportCost: string;
};

export type CreateVehicleBodyType = {
    licensePlate: string;
    payloadCapacity: number;
    fuelRatePerKm: string;
    status: VehicleStatus;
};

export type CreateRouteBodyType = {
    routeName: string;
    distanceKm: number;
    estimatedHours: number;
    baseTransportCost: number;
};