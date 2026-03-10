import { Suspense } from "react";
import BaseUnitClient from "./_components/BaseUnitClient";

export default function BaseUnitPage() {
  return (
    <Suspense
      fallback={
        <div className="p-20 text-center animate-pulse font-black italic text-slate-300 uppercase text-[10px] tracking-widest">
          Đang khởi tạo danh mục đơn vị...
        </div>
      }
    >
      <BaseUnitClient />
    </Suspense>
  );
}
