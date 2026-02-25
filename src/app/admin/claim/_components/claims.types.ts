export type ClaimStatus = "pending" | "approved" | "rejected";

export interface ClaimItemDetail {
  productName: string;
  sku: string;
  quantityMissing: number;
  quantityDamaged: number;
  reason: string;
  imageUrl?: string;
}

export interface ClaimRow {
  id: string;
  shipmentId: string;
  status: ClaimStatus;
  createdBy: string;
  createdAt: string;
  resolvedAt?: string;
}

export interface ClaimAnalytics {
  damageRate: number;
  missingRate: number;
  bottleneck?: {
    productName: string;
    totalIssues: number;
  };
}