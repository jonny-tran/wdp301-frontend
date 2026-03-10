import { Suspense } from "react";
import type { RawSearchParams } from "@/app/manager/_components/query";
import ProductClient from "./_components/ProductClient";
import ProductSkeleton from "./_components/ProductSkeleton";

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
