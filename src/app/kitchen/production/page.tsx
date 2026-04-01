import { Metadata } from "next";
import { Suspense } from "react";
import ProductionClient from "./_components/ProductionClient";
import ProductionSkeleton from "./_components/ProductionSkeleton";

export const metadata: Metadata = {
    title: "Sản xuất | Central Kitchen",
    description: "Lệnh sản xuất, công thức BOM và hoàn tất lô thành phẩm.",
};

export default function KitchenProductionPage() {
    return (
        <Suspense fallback={<ProductionSkeleton />}>
            <ProductionClient />
        </Suspense>
    );
}
