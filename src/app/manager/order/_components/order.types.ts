import { OrderStatus } from "@/utils/enum";

/**
 * Định nghĩa dữ liệu hiển thị cho Table
 */
export interface OrderRow {
    id: string;
    storeId: string;
    status: OrderStatus | string; 
    totalAmount: string;
    deliveryDate: string;
    priority: string;
    note: string | null; // Cần thiết để hiển thị lý do rejected
    createdAt: string;
}

/**
 * Dữ liệu tổng hợp cho các thẻ Analytics (KPIs)
 */
export interface OrderAnalyticsStats {
    fillRate: number;      
    totalRequested: number;  
    avgReview: number;     
    avgPicking: number;    
    avgDelivery: number;  
}


export interface OrderTableProps {
    items: OrderRow[];
    isLoading: boolean;
}