export interface Route {
    id: string;
    name: string;
    description?: string;
    stops: string[]; // List of stop locations or customer IDs
    estimatedDuration: number; // in minutes
}
