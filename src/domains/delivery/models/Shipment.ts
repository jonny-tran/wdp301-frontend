export interface Shipment {
    id: string;
    orderIds: string[];
    routeId: string;
    driverId?: string;
    status: 'pending' | 'scheduled' | 'in-transit' | 'delivered' | 'cancelled';
    expectedDeliveryTime: Date;
}
