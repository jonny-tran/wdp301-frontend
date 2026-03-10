import { Suspense } from "react";
import OrderClient from "./_components/OrderClient";
import OrderSkeleton from "./_components/OrderSkeleton";

export default async function OrderPage() {
  return (
    <main className="min-h-screen bg-slate-50/30 px-10 py-12">
      <Suspense fallback={<OrderSkeleton />}>
        <OrderClient />
      </Suspense>
    </main>
  );
}
