import { Suspense } from "react";
import InventoryClient from "./_components/InventoryClient";
import InventorySkeleton from "./_components/InventorySkeleton";

export default async function InventoryPage() {
  return (
    <Suspense fallback={<InventorySkeleton />}>
      <InventoryClient />
    </Suspense>
  );
}
