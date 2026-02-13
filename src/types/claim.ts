import { ClaimStatus } from "@/utils/enum";
import { BaseRequestPagination } from "./base";

export type ClaimItem = {
    productId: number;
    productName: string;
    batchId: number;
    batchCode?: string;
    quantityMissing: number;
    quantityDamaged: number;
    reason: string;
    imageProofUrl?: string;
};

export type Claim = {
    claimId: string;
    shipmentId: string;
    storeId?: string;
    status: string;
    description: string;
    items: ClaimItem[];
    createdAt: string;
    resolutionNote?: string;
    resolvedAt?: string;
    totalDamaged?: number;
    totalMissing?: number;
};
export type QueryClaim = BaseRequestPagination & {
    sortBy?: string
    status?: ClaimStatus
    search?: string    //search by claimId, shipmentId
    storeId?: string  // disable in be
    fromDate?: string
    toDate?: string
}