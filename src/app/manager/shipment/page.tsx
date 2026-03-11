import ShipmentClient from "./_components/ShipmentClient";
import { RawSearchParams } from "@/app/manager/_components/query";

export const metadata = {
  title: "Shipment Management | Manager Portal",
  description: "Quản lý và theo dõi lộ trình vận chuyển đơn hàng",
};

type Props = {
  searchParams: Promise<RawSearchParams>;
};

export default async function ShipmentPage({ searchParams }: Props) {
  const resolvedParams = await searchParams;
  return (
    <ShipmentClient searchParams={resolvedParams} />
  );
}
