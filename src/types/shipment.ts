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
    product_name: string
    sku: string
    batch_code: string
    quantity: string
    expiry_date: string
    image_url: string
}
export type ShipmentPickingList = {
    shipment_id: string
    order_id: string
    store_name: string
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

