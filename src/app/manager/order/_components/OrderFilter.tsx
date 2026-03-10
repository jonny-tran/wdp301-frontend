"use client";

import BaseFilter, { FilterConfig } from "@/components/layout/BaseFilter";
import { OrderStatus } from "@/utils/enum";

interface OrderFilterProps {
  currentLimit: number;
}

export default function OrderFilter({ currentLimit }: OrderFilterProps) {
  const statusOptions = [
    "pending",
    "approved",
    "rejected",
    "cancelled",
    "picking",
    "delivering",
    "completed",
    "claimed",
  ];

  const filterConfig: FilterConfig[] = [
    {
      key: "search",
      label: "Tìm kiếm",
      type: "text",
      placeholder: "Mã đơn hàng (ID)...",
      className: "md:col-span-2",
    },
    {
      key: "storeId",
      label: "Cửa hàng",
      type: "text",
      placeholder: "Mã cửa hàng...",
    },
    {
      key: "status",
      label: "Trạng thái",
      type: "select",
      options: statusOptions.map((s) => ({
        label: s.toUpperCase(),
        value: s,
      })),
    },
    {
      key: "fromDate",
      label: "Từ ngày",
      type: "date",
    },
    {
      key: "toDate",
      label: "Đến ngày",
      type: "date",
    },
    {
      key: "limit",
      label: "Số dòng",
      type: "select",
      defaultValue: String(currentLimit),
      options: [
        { label: "10", value: "10" },
        { label: "20", value: "20" },
        { label: "50", value: "50" },
      ],
    },
  ];

  return <BaseFilter filters={filterConfig} />;
}
