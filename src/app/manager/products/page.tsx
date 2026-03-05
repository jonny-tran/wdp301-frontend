<<<<<<< HEAD
import { Suspense } from "react";
import type { RawSearchParams } from "@/app/kitchen/_components/query";
=======
import { Metadata } from "next";
>>>>>>> 0da73fcc42b54874fcaea53673fda727cc87773c
import ProductClient from "./_components/ProductClient";
import ProductSkeleton from "./_components/ProductSkeleton";

<<<<<<< HEAD
type Props = {
  searchParams: Promise<RawSearchParams>;
};

export default async function ProductPage(props: Props) {
  const searchParams = await props.searchParams;

  return (
    <Suspense fallback={<ProductSkeleton />}>
      <ProductClient searchParams={searchParams} />
    </Suspense>
  );
}
=======
export const metadata: Metadata = {
    title: "Product Catalog | Manager",
    description: "Manage VFC product inventory and categories.",
};

export default function ProductsPage({ searchParams }: { searchParams: any }) {
    return (
        <main className="p-8">
            <ProductClient searchParams={searchParams} />
        </main>
    );
}
>>>>>>> 0da73fcc42b54874fcaea53673fda727cc87773c
