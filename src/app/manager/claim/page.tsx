import { Suspense } from "react";
import ClaimClient from "./_components/ClaimsClient";

export default function ClaimPage() {
  return (
    <Suspense
      fallback={
        <div className="p-20 text-center animate-pulse font-black italic text-slate-300 uppercase text-[10px] tracking-widest">
          Khởi tạo module khiếu nại...
        </div>
      }
    >
      <ClaimClient />
    </Suspense>
  );
}
