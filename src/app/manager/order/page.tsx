import { Suspense } from "react";
import OrderClient from "./_components/OrderClient";
import OrderSkeleton from "./_components/OrderSkeleton";

export default async function OrderPage() {
  return (
    <Suspense fallback={<OrderSkeleton />}>
      <OrderClient />
    </Suspense>
  );
}
