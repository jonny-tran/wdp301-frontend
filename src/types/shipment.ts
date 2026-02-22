import { ShipmentStatus } from "@/utils/enum"
import { BaseRequestPagination } from "./base"


export type Shipment = {
    id: string
    orderId: string
    storeName: string
    status: string
    shipDate: string
    createdAt: string
}

export type ShipmentItem = {
    productName: string
    sku: string
    batchCode: string
    quantity: string
    expiryDate: string
    imageUrl: string
}
export type ShipmentPickingList = {
    shipmentId: string
    orderId: string
    storeName: string
    status: string
    items: ShipmentItem[]
}
export type QueryShipment = BaseRequestPagination & {
    sortBy?: string
    status?: ShipmentStatus
    search?: string
    storeId?: string
    fromDate?: string
    toDate?: string
}

