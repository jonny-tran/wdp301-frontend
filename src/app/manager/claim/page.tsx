import { Suspense } from "react";
import ClaimClient from "./_components/ClaimsClient";
import { RawSearchParams } from "@/app/manager/_components/query";

type Props = {
  searchParams: Promise<RawSearchParams>;
};

export default async function ClaimPage({ searchParams }: Props) {
  const resolvedParams = await searchParams;
  return (
    <Suspense
      fallback={
        <div className="p-20 text-center animate-pulse font-black italic text-slate-300 uppercase text-[10px] tracking-widest">
          Khởi tạo module khiếu nại...
        </div>
      }
    >
      <ClaimClient searchParams={resolvedParams} />
    </Suspense>
  );
}
