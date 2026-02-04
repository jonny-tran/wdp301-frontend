export interface ProductionPlan {
    id: string;
    name: string;
    startDate: Date;
    endDate: Date;
    status: 'draft' | 'pending' | 'approved' | 'rejected';
}
