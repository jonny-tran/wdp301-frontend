import { Suspense } from "react";
import InventoryClient from "./_components/InventoryClient";
import InventorySkeleton from "./_components/InventorySkeleton";

export default async function InventoryPage() {
  return (
    <main className="min-h-screen bg-slate-50/30 px-10 py-12">
      <Suspense fallback={<InventorySkeleton />}>
        <InventoryClient />
      </Suspense>
    </main>
  );
}
