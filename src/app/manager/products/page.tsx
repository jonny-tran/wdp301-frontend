import { Suspense } from "react";
import ProductList from "./_components/product-list";

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function Page(props: Props) {
  const searchParams = await props.searchParams;

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ProductList searchParams={searchParams} />
    </Suspense>
  );
}
