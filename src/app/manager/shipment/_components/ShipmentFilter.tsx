"use client";

import BaseFilter, { FilterConfig } from "@/components/layout/BaseFilter";

interface ShipmentFilterProps {
  currentLimit: number;
}

export default function ShipmentFilter({ currentLimit }: ShipmentFilterProps) {
  const statusOptions = [
    "preparing",
    "picking",
    "delivering",
    "completed",
    "cancelled",
  ];

  const filterConfig: FilterConfig[] = [
    {
      key: "search",
      label: "Tìm kiếm",
      type: "text",
      placeholder: "Mã vận đơn, đơn hàng...",
      className: "md:col-span-2",
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
