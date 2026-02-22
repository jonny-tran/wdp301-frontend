import http from "@/lib/http";
import { ReceiveShipmentBodyType } from "@/schemas/shipment";
import { BaseResponePagination } from "@/types/base";
import { QueryShipment, Shipment, ShipmentPickingList } from "@/types/shipment";
import { ENDPOINT_CLIENT } from "@/utils/endponit";

export const shipmentRequest = {

    // GET /shipments
    getShipments: (query: QueryShipment) => http.get<BaseResponePagination<Shipment[]>>(ENDPOINT_CLIENT.SHIPMENTS, { query }),

    // GET /shipments/store/my
    getMyStoreShipments: (query: QueryShipment) => http.get<Shipment[]>(ENDPOINT_CLIENT.SHIPMENTS_MY_STORE, { query }),


    // GET /shipments/:id
    getShipmentDetail: (id: string) => http.get<Shipment>(ENDPOINT_CLIENT.SHIPMENT_DETAIL(id)),

    // GET /shipments/:id/picking-list
    getShipmentPickingList: (id: string) => http.get<ShipmentPickingList>(ENDPOINT_CLIENT.SHIPMENT_PICKING_LIST(id)),

    // PATCH /shipments/:id/receive-all
    receiveAllShipment: (id: string) => http.patch(ENDPOINT_CLIENT.SHIPMENT_RECEIVE_ALL(id), {}),

    // POST /shipments/:id/receive
    receiveShipment: (id: string, data: ReceiveShipmentBodyType) => http.post(ENDPOINT_CLIENT.SHIPMENT_RECEIVE(id), data),
};
