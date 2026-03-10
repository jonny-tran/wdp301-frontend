"use client";

export default function InventorySkeleton() {
  return (
    <div className="space-y-10 pb-20 animate-pulse">
      {/* HEADER SKELETON */}
      <div className="flex justify-between items-end">
        <div className="space-y-3">
          <div className="h-10 w-64 bg-slate-200 rounded-xl" />
          <div className="h-3 w-48 bg-slate-100 rounded-full" />
        </div>
        <div className="h-14 w-48 bg-slate-200 rounded-full" />
      </div>

      {/* MAIN CONTAINER SKELETON */}
      <div className="bg-white rounded-[3rem] shadow-2xl border border-slate-100 overflow-hidden">
        {/* FILTERS BAR */}
        <div className="bg-slate-50/50 px-10 py-8 border-b border-slate-100 flex items-center justify-between">
          <div className="h-12 w-96 bg-white border border-slate-100 rounded-2xl" />
          <div className="h-4 w-32 bg-slate-100 rounded-full" />
        </div>

        {/* TABLE SKELETON */}
        <div className="w-full">
          {/* Header Row */}
          <div className="bg-slate-50/30 px-10 py-6 border-b border-slate-50 flex justify-between">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-3 w-20 bg-slate-100 rounded-full" />
            ))}
          </div>

          {/* Data Rows */}
          {[1, 2, 3, 4, 5, 6].map((row) => (
            <div
              key={row}
              className="px-10 py-8 border-b border-slate-50 flex items-center justify-between"
            >
              <div className="flex items-center gap-6 flex-1">
                <div className="h-5 w-8 bg-slate-100 rounded-md" />{" "}
                {/* No. column */}
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-[1.2rem] bg-slate-100" />{" "}
                  {/* Product Image */}
                  <div className="h-4 w-40 bg-slate-100 rounded-full" />{" "}
                  {/* Product Name */}
                </div>
              </div>
              <div className="h-4 w-24 bg-slate-50 rounded-full flex-1" />{" "}
              {/* SKU */}
              <div className="h-4 w-48 bg-slate-50 rounded-full flex-1" />{" "}
              {/* Warehouse */}
              <div className="h-6 w-16 bg-primary/10 rounded-full ml-auto" />{" "}
              {/* Quantity */}
              <div className="h-6 w-12 bg-slate-50 rounded-full ml-10" />{" "}
              {/* Unit */}
            </div>
          ))}
        </div>

        {/* FOOTER SKELETON */}
        <div className="px-10 py-8 bg-slate-50/50 flex justify-center">
          <div className="h-10 w-64 bg-white rounded-full border border-slate-100" />
        </div>
      </div>
    </div>
  );
}
