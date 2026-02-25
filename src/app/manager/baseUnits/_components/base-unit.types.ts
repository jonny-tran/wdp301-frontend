export interface BaseUnitRow {
    id: number;
    name: string;
    description: string;
    createdAt: string;
}

export interface UpdateBaseUnitBody {
    name: string;
    description: string;
}