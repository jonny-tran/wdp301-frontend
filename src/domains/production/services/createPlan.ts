import { ProductionPlan } from '../models/ProductionPlan';

export const createPlan = async (plan: Omit<ProductionPlan, 'id'>): Promise<ProductionPlan> => {
    // TODO: Implement API call
    return {
        id: 'generated-id',
        ...plan,
    };
};
