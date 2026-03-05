import { Order } from "@/types/order";

export interface OrderRow extends Order {
  formattedAmount: string;
  deliveryDateFormatted: string;
  createdAtFormatted: string;
}