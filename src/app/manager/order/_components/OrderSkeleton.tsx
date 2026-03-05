"use client";

export default function OrderSkeleton() {
  return (
    <div className="space-y-10 pb-20 animate-pulse">
      {/* HEADER SKELETON: Title & Button */}
      <div className="flex justify-between items-end px-4">
        <div className="space-y-3">
          <div className="h-10 w-72 bg-slate-200 rounded-xl" />
          <div className="h-3 w-56 bg-slate-100 rounded-full" />
        </div>
        <div className="h-14 w-48 bg-slate-200 rounded-full" />
      </div>

      {/* MAIN CONTAINER SKELETON */}
      <div className="bg-white rounded-[3rem] shadow-2xl border border-slate-100 overflow-hidden">
        
        {/* TOP BAR: Search & Filter Placeholder */}
        <div className="bg-slate-50/50 px-10 py-8 border-b border-slate-100 flex items-center justify-between">
          <div className="h-12 w-96 bg-white border border-slate-100 rounded-2xl" />
          <div className="flex items-center gap-3">
            <div className="h-3 w-3 rounded-full bg-slate-200" />
            <div className="h-3 w-24 bg-slate-100 rounded-full" />
          </div>
        </div>

        {/* TABLE SKELETON: Rows mapping */}
        <div className="w-full">
          {/* Table Header Placeholder */}
          <div className="bg-slate-50/30 px-10 py-6 border-b border-slate-50 flex justify-between">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-2 w-20 bg-slate-100 rounded-full" />
            ))}
          </div>

          {/* Table Data Rows Placeholder */}
          {[1, 2, 3, 4, 5].map((row) => (
            <div key={row} className="px-10 py-8 border-b border-slate-50 flex items-center justify-between">
              <div className="flex items-center gap-8 flex-1">
                <div className="h-4 w-6 bg-slate-100 rounded-md" /> {/* No. */}
                <div className="space-y-2">
                  <div className="h-4 w-32 bg-slate-200 rounded-md" /> {/* Order ID */}
                  <div className="h-2 w-20 bg-slate-100 rounded-full" /> {/* Store ID */}
                </div>
              </div>
              <div className="h-6 w-28 bg-indigo-50 rounded-lg flex-1 mx-4" /> {/* Amount */}
              <div className="h-4 w-24 bg-slate-50 rounded-full flex-1" /> {/* Delivery Date */}
              <div className="h-6 w-24 bg-slate-100 rounded-full flex-1" /> {/* Status Badge */}
              <div className="h-10 w-10 bg-slate-50 rounded-xl ml-auto" /> {/* Action Button */}
            </div>
          ))}
        </div>

        {/* FOOTER SKELETON */}
        <div className="bg-slate-50/50 px-10 py-6">
          <div className="h-3 w-48 bg-slate-100 rounded-full" />
        </div>
      </div>
    </div>
  );
}