import { z } from "zod";

// Order Analytics
export const OrderFillRateQuerySchema = z.object({
    storeId: z.string().optional(),
    from: z.string().optional(),
    to: z.string().optional(),
});
export type OrderFillRateQueryType = z.infer<typeof OrderFillRateQuerySchema>;

export const OrderSLAQuerySchema = z.object({
    from: z.string().optional(),
    to: z.string().optional(),
});
export type OrderSLAQueryType = z.infer<typeof OrderSLAQuerySchema>;

// Store Analytics
export const StoreDemandPatternQuerySchema = z.object({
    productId: z.coerce.number().optional(),
});
export type StoreDemandPatternQueryType = z.infer<typeof StoreDemandPatternQuerySchema>;

// Claim Analytics
export const ClaimAnalyticsQuerySchema = z.object({
    productId: z.coerce.number().optional(),
});
export type ClaimAnalyticsQueryType = z.infer<typeof ClaimAnalyticsQuerySchema>;

// Inventory Analytics
export const InventoryAgingQuerySchema = z.object({
    daysThreshold: z.coerce.number().optional(),
});
export type InventoryAgingQueryType = z.infer<typeof InventoryAgingQuerySchema>;

export const InventoryWasteQuerySchema = z.object({
    fromDate: z.string().optional(),
    toDate: z.string().optional(),
});
export type InventoryWasteQueryType = z.infer<typeof InventoryWasteQuerySchema>;

export const FinancialLossQuerySchema = z.object({
    from: z.string().optional(),
    to: z.string().optional(),
});
export type FinancialLossQueryType = z.infer<typeof FinancialLossQuerySchema>;
