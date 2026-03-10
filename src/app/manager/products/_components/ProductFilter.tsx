"use client";

import BaseFilter, { FilterConfig } from "@/components/layout/BaseFilter";

interface ProductFilterProps {
  currentLimit: number;
}

export default function ProductFilter({ currentLimit }: ProductFilterProps) {
  const filterConfig: FilterConfig[] = [
    {
      key: "search",
      label: "Tìm kiếm",
      type: "text",
      placeholder: "Tên hoặc SKU...",
      className: "lg:col-span-2",
    },
    {
      key: "isActive",
      label: "Trạng thái",
      type: "select",
      options: [
        { label: "Hoạt động", value: "true" },
        { label: "Đã ẩn", value: "false" },
      ],
      className: "lg:col-span-1",
    },
    {
      key: "limit",
      label: "Số dòng",
      type: "select",
      defaultValue: String(currentLimit),
      options: [
        { label: "10 dòng", value: "10" },
        { label: "20 dòng", value: "20" },
        { label: "50 dòng", value: "50" },
      ],
      className: "lg:col-span-1",
    },
  ];

  return <BaseFilter filters={filterConfig} />;
}
