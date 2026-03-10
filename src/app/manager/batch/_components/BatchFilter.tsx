"use client";

import BaseFilter, { FilterConfig } from "@/components/layout/BaseFilter";

interface BatchFilterProps {
  currentLimit: number;
}

export default function BatchFilter({ currentLimit }: BatchFilterProps) {
  const filterConfig: FilterConfig[] = [
    {
      key: "search",
      label: "Tìm kiếm",
      type: "text",
      placeholder: "Mã lô hàng...",
      className: "md:col-span-2",
    },
    {
      key: "productId",
      label: "Mã sản phẩm",
      type: "text",
      placeholder: "Lọc theo Product ID...",
    },
    {
      key: "fromDate",
      label: "Sản xuất từ",
      type: "date",
    },
    {
      key: "toDate",
      label: "Tới ngày",
      type: "date",
    },
    {
      key: "limit",
      label: "Số lượng hiển thị",
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
