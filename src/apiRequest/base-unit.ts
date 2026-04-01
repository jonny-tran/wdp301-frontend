import http from "@/lib/http";
import { CreateBaseUnitBodyType, UpdateBaseUnitBodyType } from "@/schemas/base-unit";
import { BaseUnit, QueryBaseUnitList } from "@/types/base-unit";
import { ENDPOINT_CLIENT } from "@/utils/endponit";

export const baseUnitRequest = {
    // GET /base-units?page=&limit=&sortOrder=&isActive=
    getBaseUnits: (query?: QueryBaseUnitList) =>
        http.get<BaseUnit[]>(ENDPOINT_CLIENT.BASE_UNITS, { query }),

    // POST /base-units
    createBaseUnit: (data: CreateBaseUnitBodyType) => http.post<BaseUnit>(ENDPOINT_CLIENT.BASE_UNITS, data),

    // GET /base-units/:id
    getBaseUnitDetail: (id: number) => http.get<BaseUnit>(ENDPOINT_CLIENT.BASE_UNIT_DETAIL(id)),

    // PATCH /base-units/:id
    updateBaseUnit: (id: number, data: UpdateBaseUnitBodyType) => http.patch<BaseUnit>(ENDPOINT_CLIENT.BASE_UNIT_DETAIL(id), data),

    // DELETE /base-units/:id
    deleteBaseUnit: (id: number) => http.delete(ENDPOINT_CLIENT.BASE_UNIT_DETAIL(id)),
};
