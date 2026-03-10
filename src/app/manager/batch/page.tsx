import type { RawSearchParams } from "@/app/manager/_components/query";
import BatchClient from "./_components/BatchClient";

export const metadata = {
  title: "Quản lý Lô hàng",
  description: "Theo dõi tồn kho theo đợt nhập và hạn sử dụng sản phẩm",
};

export default async function BatchPage({
  searchParams,
}: {
  searchParams: Promise<RawSearchParams>;
}) {
  const params = await searchParams;
  return (
    <main className="p-4 md:p-10">
      <BatchClient searchParams={params} />
    </main>
  );
}
