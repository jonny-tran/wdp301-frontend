import { ClaimRow } from "./claims.types";
import { format } from "date-fns";

/**
 * Interface mở rộng để định nghĩa cấu trúc dữ liệu thô từ API
 * giúp việc ép kiểu từ unknown an toàn hơn
 */
interface RawClaimItem {
  id: string;
  shipmentId: string;
  status: string;
  createdAt: string;
  [key: string]: unknown;
}

interface RawClaimResponse {
  items?: RawClaimItem[];
  [key: string]: unknown;
}

export const extractClaims = (response: unknown, rowStart: number): ClaimRow[] => {
    // Ép kiểu unknown về cấu trúc mong muốn một cách an toàn
    const res = response as RawClaimResponse;
    const rawItems = res?.items || [];
    
    if (!Array.isArray(rawItems)) return [];

    return rawItems.map((item: RawClaimItem, index: number) => ({
        no: `#${String(rowStart + index + 1).padStart(2, "0")}`,
        claimId: item.id,
        shipmentId: item.shipmentId,
        status: item.status,
        createdAt: item.createdAt ? format(new Date(item.createdAt), "dd/MM/yyyy") : "N/A",
        totalIssues: 0, 
        description: "Khiếu nại vận chuyển"
    }));
};

/**
 * Định nghĩa cấu trúc cho dữ liệu chi tiết khiếu nại
 */
interface RawClaimDetail {
  id: string;
  shipmentId: string;
  status: string;
  createdAt: string;
  resolvedAt?: string;
  items?: Array<{
    productName: string;
    sku: string;
    quantityMissing: number;
    quantityDamaged: number;
    reason?: string;
    imageUrl?: string;
  }>;
}

export const extractClaimDetail = (data: unknown) => {
    if (!data) return null;

    const detail = data as RawClaimDetail;

    return {
        id: detail.id,
        shipmentId: detail.shipmentId,
        status: detail.status,
        createdAt: detail.createdAt,
        resolvedAt: detail.resolvedAt,
        items: (detail.items || []).map((item) => ({
            name: item.productName,
            sku: item.sku,
            missing: item.quantityMissing,
            damaged: item.quantityDamaged,
            reason: item.reason ?? "Không có lý do",
            image: item.imageUrl
        }))
    };
};