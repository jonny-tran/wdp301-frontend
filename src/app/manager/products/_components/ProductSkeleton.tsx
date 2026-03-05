"use client";

/**
 * ProductSkeleton tuân thủ phong cách System:
 * - Bo góc lớn (rounded-3xl/rounded-[3.5rem])
 * - Hiệu ứng pulse đồng bộ cho toàn bộ table
 */
export default function ProductSkeleton() {
  return (
    <div className="flex flex-col gap-10 pb-20 animate-pulse">
      {/* 1. Header Skeleton */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-1">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="h-14 w-14 bg-slate-200 rounded-[1.5rem]" />
            <div className="h-10 w-64 bg-slate-200 rounded-xl" />
          </div>
          <div className="h-4 w-40 bg-slate-100 rounded-lg ml-1" />
        </div>
        <div className="h-16 w-48 bg-slate-200 rounded-full" />
      </div>

      {/* 2. Filter Bar Skeleton */}
      <div className="h-24 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm" />

      {/* 3. Main Table Skeleton */}
      <div className="rounded-[3.5rem] border border-slate-100 bg-white shadow-2xl overflow-hidden min-h-600px">
        {/* Table Header Placeholder */}
        <div className="h-16 bg-slate-50/50 border-b border-slate-50 px-12 py-5" />

        {/* Rows Placeholder */}
        <div className="divide-y divide-slate-100">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="px-10 py-8 flex items-center justify-between"
            >
              <div className="flex items-center gap-6">
                {/* No. index placeholder */}
                <div className="h-6 w-8 bg-slate-100 rounded" />
                {/* Product Image & Name placeholder */}
                <div className="h-16 w-16 bg-slate-200 rounded-[1.2rem]" />
                <div className="space-y-2">
                  <div className="h-5 w-48 bg-slate-200 rounded-lg" />
                  <div className="h-3 w-24 bg-slate-100 rounded-md" />
                </div>
              </div>
              <div className="hidden md:flex flex-col gap-2 items-center">
                <div className="h-6 w-20 bg-blue-50 rounded-lg" />
                <div className="h-3 w-24 bg-slate-50 rounded-md" />
              </div>
              <div className="h-12 w-32 bg-slate-100 rounded-full" />
            </div>
          ))}
        </div>

        {/* Footer Pagination Placeholder */}
        <div className="h-24 bg-slate-50/30 border-t border-slate-100 px-12 py-10" />
      </div>
    </div>
  );
}
