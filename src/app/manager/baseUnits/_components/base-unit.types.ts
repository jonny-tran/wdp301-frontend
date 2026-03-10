import { BaseUnit as ApiBaseUnit } from "@/types/base-unit";

export interface BaseUnitRow {
    no: string;
    id: number;
    name: string;
    description: string;
}

export type BaseUnitResponse = ApiBaseUnit[];